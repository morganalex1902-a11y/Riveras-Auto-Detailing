# Riviera's Auto Detailing Dashboard - Implementation Log

## Project Overview
This is a service request management system for an auto detailing dealership with role-based access and real-time notifications.

**Key Users:**
- **Sales Reps**: Create service requests, view their own requests and progress
- **Admins**: View all requests, manage pricing, update status, and receive notifications

---

## Architecture & File Structure

### Context Layer (`src/contexts/AuthContext.tsx`)
Manages global state including:
- User authentication
- Service requests database
- Real-time notifications

### Pages
- `src/pages/Dashboard.tsx` - Main dashboard for both sales reps and admins

### Components
- UI components: `button`, `input`, `checkbox`, `select`, `textarea`, `table`, `dialog`, `card`

---

## Data Models

### User Interface
```typescript
interface User {
  email: string;
  name?: string;
  role: "sales_rep" | "admin";
}
```

### ServiceRequest Interface (Enhanced)
```typescript
interface ServiceRequest {
  id: number;
  requestNumber: string;           // Auto-generated (REQ-001, REQ-002, etc.)
  requestedBy: string;             // User email who created it
  manager?: string;                // Optional manager assignment
  stockVin: string;                // Stock or VIN number
  poNumber?: string;               // Purchase order number
  vehicleDescription: string;      // Description of vehicle
  year: number;
  make: string;
  model: string;
  color: string;
  dateRequested: string;           // Auto-filled with today's date
  dueDate: string;                 // YYYY-MM-DD format
  dueTime: string;                 // HH:MM format
  mainServices: string[];          // Multi-select array
  additionalServices: string[];    // Multi-select array
  notes: string;                   // Special instructions/notes
  status: "Pending" | "In Progress" | "Completed";
  price: number;                   // Set by admin only
  
  // Backward compatibility fields
  service?: string;
  vin?: string;
  due?: string;
}
```

### Main Services (10 options)
1. N/C Delivery
2. Clean for Showroom
3. U/C Detail
4. U/C Delivery
5. Wholesale Detail
6. Service Wash In/Out
7. Service Express Wax
8. Service Full Detail
9. Exterior Detail Only
10. Interior Detail Only

### Additional Services (10 options)
1. Exterior Paint Protection
2. Interior Protection
3. Scratch Removal
4. Restore Headlights
5. Ozone Odor Removal
6. Tint Removal
7. Heavy Compound
8. N/C Lot Prep.
9. Paint Overspray Removal
10. Excessive Dog Hair

---

## Context Updates (`src/contexts/AuthContext.tsx`)

### New Context Methods
```typescript
interface AuthContextType {
  // ... existing methods
  newRequestCount: number;         // Counter for new requests
  resetNewRequestCount: () => void; // Reset the counter
  onNewRequest?: (request: ServiceRequest) => void; // Callback for new requests
}
```

### Enhanced addRequest() Method
- Generates unique `requestNumber` in format `REQ-XXX`
- Increments `newRequestCount` when new request is added
- Triggers localStorage event for cross-tab notification:
  ```typescript
  localStorage.setItem("new-request-notification", JSON.stringify({
    requestNumber: newRequest.requestNumber,
    requestedBy: newRequest.requestedBy,
    timestamp: new Date().toISOString(),
  }));
  ```

---

## Dashboard Implementation (`src/pages/Dashboard.tsx`)

### Form Fields Structure

#### Request Information Section
- **Request Number** (auto-generated, disabled)
- **Sales/Service Advisor** (auto-filled from logged-in user, disabled)
- **Manager** (optional text input)

#### Stock & Order Information
- **Stock or VIN #** (required)
- **PO#** (optional)

#### Vehicle Description
- **Vehicle Description** (required - e.g., "Customer vehicle", "Trade-in", "Fleet vehicle")
- **Year** (required, number)
- **Make** (required)
- **Model** (required)
- **Color** (required)

#### Request Dates & Times
- **Date Requested** (auto-filled with today's date, disabled)
- **Due Date** (required, date input)
- **Due Time** (required, time input)

#### Main Services (Multi-Select Checkboxes)
- 10 checkbox options with Controller from react-hook-form
- Stored as array in form data

#### Additional Services (Multi-Select Checkboxes)
- 10 checkbox options with Controller from react-hook-form
- Stored as array in form data

#### Special Instructions / Notes
- Textarea field

#### Total Price (Admin Only)
- Number input, visible only to admin users
- Uses `user?.role === "admin"` check

### Role-Based Filtering Logic

```typescript
// Filter requests based on user role
const userRequests = useMemo(() => {
  if (user?.role === "admin") {
    return requests;  // Admins see all requests
  }
  // Sales reps only see their own requests
  return requests.filter((r) => r.requestedBy === user?.email);
}, [requests, user]);
```

**How it works:**
- **Admins**: See all requests from all sales reps
- **Sales Reps**: Only see requests they created (matched by email)

### Status Filter
```typescript
const filteredRequests = useMemo(() => {
  return statusFilter === "All"
    ? userRequests
    : userRequests.filter((r) => r.status === statusFilter);
}, [userRequests, statusFilter]);
```
- Filters visible requests by status (Pending, In Progress, Completed)
- Works on top of role-based filtering

### Statistics Calculation
```typescript
const stats = useMemo(() => {
  const total = userRequests.length;
  const pending = userRequests.filter((r) => r.status === "Pending").length;
  const inProgress = userRequests.filter((r) => r.status === "In Progress").length;
  const completed = userRequests.filter((r) => r.status === "Completed").length;
  const revenue = userRequests
    .filter((r) => r.status === "Completed")
    .reduce((sum, r) => sum + r.price, 0);
  return { total, pending, inProgress, completed, revenue };
}, [userRequests]);
```
- **Sales Reps**: See stats only for their own requests
- **Admins**: See stats for all requests in the system

---

## Notification System

### Admin Notification Badge
Location: `src/pages/Dashboard.tsx:286-297`

```typescript
{user?.role === "admin" && newRequestCount > 0 && (
  <button
    onClick={resetNewRequestCount}
    className="relative inline-flex items-center justify-center w-8 h-8 bg-destructive text-white text-xs font-bold rounded-full hover:bg-destructive/80 transition-colors"
    title={`${newRequestCount} new request${newRequestCount > 1 ? "s" : ""}`}
  >
    {newRequestCount}
  </button>
)}
```

**Features:**
- Red badge shows number of new requests
- Only visible to admin users
- Clickable to reset counter
- Appears next to "Dashboard" title

### Toast Notifications
Two notification mechanisms:

1. **Cross-Tab Notification** (using localStorage):
   ```typescript
   useEffect(() => {
     const handleStorageChange = (e: StorageEvent) => {
       if (e.key === "new-request-notification" && user?.role === "admin" && e.newValue) {
         const notification = JSON.parse(e.newValue);
         toast({
           title: "New Request Received!",
           description: `New request from ${notification.requestedBy} - ${notification.requestNumber}`,
         });
       }
     };
     window.addEventListener("storage", handleStorageChange);
     return () => window.removeEventListener("storage", handleStorageChange);
   }, [user, toast]);
   ```

2. **In-App Notification** (using newRequestCount):
   ```typescript
   useEffect(() => {
     if (user?.role === "admin" && newRequestCount > 0) {
       const unreadRequests = requests.filter((r) => r.status === "Pending");
       if (unreadRequests.length > 0) {
         toast({
           title: `${newRequestCount} New Request${newRequestCount > 1 ? "s" : ""}`,
           description: "Click 'New Requests' badge to review.",
         });
       }
     }
   }, [newRequestCount, user, requests, toast]);
   ```

---

## Admin Edit Functionality

### Status Editing
Location: `src/pages/Dashboard.tsx:842-884`

**Features:**
- Only visible to admin users: `user?.role === "admin" && editingId === request.id`
- Dropdown select to change status (Pending → In Progress → Completed)
- Checkmark button to save
- Shows status badge when not editing

```typescript
{user?.role === "admin" && editingId === request.id ? (
  <div className="flex gap-1">
    <Select
      defaultValue={request.status}
      onValueChange={(value) => setEditingStatus(value)}
    >
      {/* Status dropdown options */}
    </Select>
    <Button onClick={() => handleSaveStatus(request.id, editingStatus || request.status)}>
      ✓
    </Button>
  </div>
) : (
  <span className={/* status badge styling */}>
    {request.status}
  </span>
)}
```

### Price Editing
Location: `src/pages/Dashboard.tsx:885-908`

**Features:**
- Only visible to admin users
- Number input field with decimal support
- Checkmark button to save
- Shows formatted price when not editing

```typescript
{user?.role === "admin" && editingId === request.id ? (
  <div className="flex gap-1">
    <Input
      type="number"
      value={editingPrice}
      onChange={(e) => setEditingPrice(parseFloat(e.target.value) || 0)}
    />
    <Button onClick={() => handleSavePrice(request.id, editingPrice)}>
      ✓
    </Button>
  </div>
) : (
  <span className="font-display text-sm text-primary">
    ${request.price.toFixed(2)}
  </span>
)}
```

### Edit Button
Location: `src/pages/Dashboard.tsx:909-925`

- Only visible to admin users: `user?.role === "admin"`
- Opens dialog showing full request details
- Triggers edit mode for status and price

---

## Real-Time Update Flow

### When Admin Changes Status/Price:

1. **Admin clicks edit button** → Sets `editingId` and opens details modal
2. **Admin changes status or price** → State updates in real-time
3. **Admin clicks checkmark** → Calls `handleSaveStatus()` or `handleSavePrice()`
4. **Context updates** → `updateRequestStatus()` or `updateRequestPrice()` updates `requests` state
5. **Sales Rep Dashboard Refreshes** → `userRequests` useMemo re-calculates based on new `requests`
6. **Sales Rep Sees Update** → Their dashboard shows new price and status immediately

### Why This Works (Same App Context):
- Both admin and sales rep use same `useAuth()` context
- Updating `requests` in context triggers all components using `useAuth()` to re-render
- No API calls needed - instant in-memory sync

---

## Form Submission Flow

### When Sales Rep Submits New Request:

1. **Form validation** → All required fields checked
2. **Call `onFormSubmit()`**:
   ```typescript
   addRequest({
     requestNumber: generateRequestNumber(),     // REQ-XXX
     requestedBy: user?.email,                   // Auto-filled
     manager: data.manager || undefined,         // Optional
     stockVin: data.stockVin,
     poNumber: data.poNumber || undefined,
     vehicleDescription: data.vehicleDescription,
     year: data.year,
     make: data.make,
     model: data.model,
     color: data.color,
     dateRequested: getTodayDate(),             // Auto-filled
     dueDate: data.dueDate,
     dueTime: data.dueTime,
     mainServices: data.mainServices,           // Array
     additionalServices: data.additionalServices, // Array
     notes: data.notes,
     status: "Pending",
     price: data.price || 0,
   });
   ```

3. **Request Added to Context** → `addRequest()` in AuthContext:
   - Generates unique ID
   - Increments `newRequestCount`
   - Triggers localStorage notification

4. **Toast Notification** → "Request Submitted" appears

5. **Form Reset** → All fields cleared

6. **Dialog Closes** → Form hidden

7. **Admin Gets Notified** → Badge shows "1" and toast appears

---

## Data Export (CSV)

### Export Function
Location: `src/pages/Dashboard.tsx:190-208`

**Exported Columns:**
- Request #
- Requested By
- Manager
- Vehicle (Year Make Model)
- Color
- Stock/VIN
- PO#
- Due Date
- Main Services (semicolon-separated)
- Additional Services (semicolon-separated)
- Status
- Price

**Behavior:**
- Exports only visible requests (respects role filtering)
- Filename format: `requests-YYYY-MM-DD.csv`
- Creates downloadable file in user's browser

---

## Table Display

### Column Headers
1. Request #
2. Requested By
3. Vehicle (with color)
4. Stock/VIN
5. Services (shows first 2 main + count if more)
6. Due Date & Time
7. Status (editable for admins)
8. Price (editable for admins)
9. Actions (edit button, admin only)

### Conditional Rendering

**Sales Reps See:**
- Their own requests only
- Status and price (read-only)
- Details button (view-only modal)

**Admins See:**
- All requests
- Editable status dropdown
- Editable price field
- Edit button to access full details modal

---

## Key Files & Line References

### AuthContext (`src/contexts/AuthContext.tsx`)
- `Line 9-28`: ServiceRequest interface with new fields
- `Line 34-46`: AuthContextType with notification methods
- `Line 50`: newRequestCount state
- `Line 217-231`: addRequest() with notification logic
- `Line 232-239`: resetNewRequestCount() method

### Dashboard (`src/pages/Dashboard.tsx`)
- `Line 1`: useEffect import
- `Line 53-77`: Service options constants
- `Line 101`: useAuth destructuring with notification methods
- `Line 113-142`: Notification effects and listeners
- `Line 148-167`: Role-based filtering logic
- `Line 286-297`: Admin badge component
- `Line 286-348`: Form fields (Request Information through Price)
- `Line 842-884`: Status editing (admin only)
- `Line 885-908`: Price editing (admin only)
- `Line 909-997`: Edit button and details modal (admin only)

---

## Important Notes for Future Updates

### When Adding New Fields:
1. Update `ServiceRequest` interface in `src/contexts/AuthContext.tsx`
2. Update sample data in `AuthProvider` initial state
3. Add form field in `Dashboard.tsx` form section
4. Add to CSV export headers if needed
5. Add to details modal display

### When Modifying Permissions:
- Check all `user?.role === "admin"` conditionals
- Update export CSV if needed
- Update form visibility conditions

### When Changing Filtering Logic:
- Update `userRequests` useMemo calculation
- Verify stats calculation includes role checks
- Test both sales rep and admin views

### State Management:
- All requests live in AuthContext (in-memory)
- No backend database - data persists only during session
- localStorage only used for cross-tab notifications
- To add persistence: integrate with backend API

---

## Testing Checklist

### Sales Rep Flow
- [ ] Can create new request with all fields
- [ ] Only sees their own requests
- [ ] Cannot edit price or status
- [ ] Cannot access admin features
- [ ] Sees request updates when admin changes status/price

### Admin Flow
- [ ] Receives notification badge when new request created
- [ ] Can see all requests from all users
- [ ] Can edit status (Pending → In Progress → Completed)
- [ ] Can set/edit price
- [ ] Can export CSV with all data
- [ ] Stats show all requests (not filtered)

### General
- [ ] Status filter works correctly
- [ ] Export CSV has correct format
- [ ] Date formatting is correct (YYYY-MM-DD)
- [ ] Time formatting is correct (HH:MM)
- [ ] Services display properly in table
- [ ] Modal shows all request details
- [ ] Toast notifications appear

---

## Session Storage Notes

### localStorage Events
- Key: `"new-request-notification"`
- Value: JSON object with requestNumber, requestedBy, timestamp
- Used for: Cross-tab admin notifications

### Context State (In-Memory)
- `requests[]`: All service requests
- `newRequestCount`: Badge counter
- `user`: Current logged-in user
- Lost on page refresh (by design for demo)

---

## Future Enhancement Ideas

1. **Backend Integration**: Replace in-memory state with API calls
2. **Persistent Database**: Save requests to MongoDB/PostgreSQL
3. **Email Notifications**: Send email alerts to admins
4. **SMS Alerts**: Text message notifications for urgent requests
5. **Request History**: Track status change history with timestamps
6. **File Uploads**: Allow users to attach photos to requests
7. **Service Pricing**: Pre-set pricing templates for services
8. **Customer Management**: Link requests to customer profiles
9. **Team Assignments**: Assign work to specific detailing teams
10. **Calendar View**: Visual calendar of scheduled requests
