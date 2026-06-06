# security_spec.md

## 1. Data Invariants

1. **User Profiles (`userProfiles/{userId}`)**:
   - The document ID `{userId}` must exactly match the authenticated user's UID (`request.auth.uid`).
   - Profile documents must contain exact fields: `uid`, `email`, `displayName`, `loyaltyPoints`, and `createdAt`. No extra fields ("shadow parameters") are permitted.
   - The user cannot elevate their own high roles or set unauthorized fields.
   - Users cannot update their `uid` or `createdAt` fields once created (immutability).
   - All email fields must be verified if verification is required.

2. **Orders (`orders/{orderId}`)**:
   - The user creating the order must be authenticated, and their UID must match the order's `userId` field (Identity Integrity).
   - An order's ID on path `{orderId}` must match `order.orderId` inside the payload.
   - When creating an order, `createdAt` must match `request.time`.
   - The `status` field must be set to `pending` upon creation.
   - Users cannot modify or delete their orders once created (`allow update, delete: if false`). Only admins or automated backend endpoints can process/complete or cancel them.
   - Individual fields in the order must pass strict type constraints: `totalPrice` is `number`, `items` is `list`, and list sizes must not exceed limits to prevent resource exhaustion attacks.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following attack payloads will be successfully blocked either by schema validation or identity checks (`PERMISSION_DENIED` outcomes).

### Case 1: Identity Spoofing (Impersonating another User's ID on Profile)
- **Path**: `userProfiles/victim_user_123`
- **Method**: `create`
- **Payload**:
  ```json
  {
    "uid": "victim_user_123",
    "email": "malicious@attack.com",
    "displayName": "Impersonator",
    "loyaltyPoints": 99999,
    "createdAt": "2026-06-02T21:24:52Z"
  }
  ```
- **Error**: Blocked because authenticated user UID `attacker_uid != "victim_user_123"`.

### Case 2: Ghost Key Injection (Shadow variables)
- **Path**: `userProfiles/attacker_uid`
- **Method**: `create`
- **Payload**:
  ```json
  {
    "uid": "attacker_uid",
    "email": "attacker@gmail.com",
    "displayName": "Hacker",
    "loyaltyPoints": 0,
    "createdAt": "2026-06-02T21:24:52Z",
    "isAdmin": true
  }
  ```
- **Error**: Blocked because total keys strictly must equal 5, and keys must not contain unauthorized properties like `isAdmin`.

### Case 3: PII Blanket Read (Accessing non-owned User profile details)
- **Path**: `userProfiles/victim_user`
- **Method**: `get`
- **Credentials**: Authenticated as `attacker_uid` (not owner)
- **Error**: Blocked because read is only allowed if `userId == request.auth.uid`.

### Case 4: Loyalty Points Self-Inflation (Creating self-credited profile)
- **Path**: `userProfiles/attacker_uid`
- **Method**: `create`
- **Payload**:
  ```json
  {
    "uid": "attacker_uid",
    "email": "attacker@gmail.com",
    "displayName": "Hacker",
    "loyaltyPoints": 99999999,
    "createdAt": "2026-06-02T21:24:52Z"
  }
  ```
- **Error**: Blocked because upon profile generation, initial `loyaltyPoints` must follow exact limits (e.g. `<= 500` or exactly equal to `0` or `125` depending on standard loyalty onboarding).

### Case 5: Temporal Fraud (Mismatched CreatedAt)
- **Path**: `userProfiles/attacker_uid`
- **Method**: `create`
- **Payload**:
  ```json
  {
    "uid": "attacker_uid",
    "email": "attacker@test.com",
    "displayName": "Time Traveler",
    "loyaltyPoints": 0,
    "createdAt": "2020-01-01T00:00:00Z"
  }
  ```
- **Error**: Blocked because `createdAt` must strictly match the server time `request.time`.

### Case 6: Order Owner Privilege Escalation
- **Path**: `orders/order_xyz`
- **Method**: `create`
- **Payload**:
  ```json
  {
    "orderId": "order_xyz",
    "userId": "victim_uid",
    "items": [],
    "totalPrice": 100,
    "status": "pending",
    "createdAt": "2026-06-02T21:24:52Z"
  }
  ```
- **Error**: Blocked because payload `userId` must equal authenticated `request.auth.uid`.

### Case 7: Invalid Order Status Shortcut (Skipping pending state)
- **Path**: `orders/order_xyz`
- **Method**: `create`
- **Payload**:
  ```json
  {
    "orderId": "order_xyz",
    "userId": "attacker_uid",
    "items": [],
    "totalPrice": 250,
    "status": "completed",
    "createdAt": "2026-06-02T21:24:52Z"
  }
  ```
- **Error**: Blocked because new order status must strictly match `pending`.

### Case 8: Order Poison-Value Injection (Resource exhaustion)
- **Path**: `orders/order_xyz`
- **Method**: `create`
- **Payload**:
  ```json
  {
    "orderId": "order_xyz",
    "userId": "attacker_uid",
    "items": "highly-unbounded-giant-string-designed-to-bloat-db-storage-and-exhaust-memory",
    "totalPrice": 300,
    "status": "pending",
    "createdAt": "2026-06-02T21:24:52Z"
  }
  ```
- **Error**: Blocked because `items` must be a list type (`is list`).

### Case 9: Unauthorized Order Modifications
- **Path**: `orders/existing_order_abc`
- **Method**: `update`
- **Payload**: Modifying `status` to `completed` or changing items.
- **Error**: Blocked because client updates to orders are disabled (`allow update: if false`).

### Case 10: ID Path Poisoning on Profile
- **Path**: `userProfiles/very_long_invalid_weird_characters_id_%20_$$$_injection`
- **Method**: `create`
- **Error**: Blocked because document path ID fails Regex validation checks and string length constraints.

### Case 11: Unverified Email Login Attack
- **Path**: `userProfiles/attacker_uid`
- **Method**: `create`
- **Credentials**: `request.auth.token.email_verified == false` (if user verification is strictly mandated by standard setup).
- **Error**: Blocked because verification is mandatory for authenticated operations.

### Case 12: Absolute Immutable Overwrite
- **Path**: `userProfiles/attacker_uid`
- **Method**: `update`
- **Payload**: Changing `createdAt` or `email` payload values.
- **Error**: Blocked because update check prevents modification of original immutable fields once stored.

---

## 3. Test Runner Concept

For local environments, the mock assertions would prove:
```ts
describe("Firestore Security Rules Tests", () => {
  it("should deny Casewise 1-12 attacks", async () => {
    // Assert userProfiles and orders validations return permission_denied for invalid tokens and structures
  });
});
```
