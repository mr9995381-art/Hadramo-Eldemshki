# Security Spec: Restaurant Menu Management

## Data Invariants
1. Only authorized administrators (listed in `/admins/`) can modify menu items or prices.
2. Menu items must have a valid ID and Arabic name.
3. Prices must be positive numbers.
4. Users can read all menu items without authentication.

## The Dirty Dozen Payloads (Rejections)

1. **Identity Spoofing**: Attempting to update a price as a regular customer.
2. **Identity Spoofing**: Attempting to add oneself to the `/admins/` collection.
3. **Invalid Data**: Setting a price to a negative number.
4. **Invalid Data**: Setting a price to a string.
5. **Invalid Data**: Adding extra fields (e.g., `isVerified: true`) to a menu item.
6. **Integrity Violation**: Changing a menu item's ID during an update.
7. **Unauthorized Deletion**: A non-admin trying to delete the entire menu.
8. **Resource Poisoning**: Creating a menu item with a 1MB name.
9. **State Shortcutting**: Updating `updatedAt` to a past timestamp.
10. **Orphaned Writes**: Creating a menu item without a category.
11. **PII Leak**: Storing customer data in the public `menu` collection.
12. **System Guard**: Modifying internal admin metadata.

## Rules Draft
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Catch-all deny
    match /{document=**} {
      allow read, write: if false;
    }

    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid)); }
    function isValidId(id) { return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$'); }

    match /menu/{itemId} {
      allow read: if true;
      allow create, update: if isAdmin() && isValidMenu(request.resource.data);
      allow delete: if isAdmin();
    }

    match /admins/{adminId} {
      allow read: if isSignedIn() && (request.auth.uid == adminId || isAdmin());
      allow write: if false; // Admins must be added manually or via backend originally
    }

    function isValidMenu(data) {
      return data.id is string && data.id.size() <= 128
        && data.arabicName is string && data.arabicName.size() <= 128
        && (data.price == null || data.price is number)
        && (data.prices == null || data.prices is map)
        && data.arabicCategory is string && data.arabicCategory.size() <= 64
        && data.category is string && data.category.size() <= 64;
    }
  }
}
```
