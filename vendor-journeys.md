# AtSpaces Vendor Journeys

**Product:** AtSpaces – Vendor Operations Portal  
**Core Promise:** Simplicity, Real-Time Control, and Operational Clarity

---

## Account Overview

*   **Account Type:** Vendor
*   **Purpose:** Manage branch capacity and daily operations.
*   **Authentication:** Email + Password login.
*   **Scope:** Vendors manage the physical reality (capacity & availability) of a single branch. They **cannot** control pricing or policies — those are admin-only.
*   **Primary Actions:** Set capacity, toggle availability, view bookings, check-in users, track performance.

> [!IMPORTANT]
> **Architecture Note: Separate Frontend Application**
> The Vendor operations portal is a **completely separate frontend application** from the Customer-facing AtSpaces booking website. 
> *   **Hosting:** It will run on a separate domain/subdomain (e.g., `vendor.atspaces.com`).
> *   **Authentication:** It uses its own Auth context (Email/Password) totally isolated from the Customer OTP auth.
> *   **Styling:** While it shares the AtSpaces brand design system, it uses an internal "dashboard" layout rather than a marketing/booking layout.

---

## 1️⃣ Vendor Journey: Onboarding & Setup

### Phase 1A: Public Registration ("Become a Vendor")
**Goal:** Allow interested workspace owners to apply to join the AtSpaces network.

*   **Trigger:** User clicks "Become a Vendor" on the public marketing site.
*   **User Actions:**
    *   Fills out a multi-step application form (Contact Info, Branch Details, Photos).
    *   Submits application for admin review.
*   **User Emotions:** Aspirational, Professional
*   **Pain Points:** Long forms, Unclear requirements.
*   **Platform Experience:** Clean, segmented form with progress indicators.
*   **Strategic Outcome:** Lead generation for new branches.

#### Frontend Requirements [FE-03]
*   **Page:** `/become-a-vendor` (Public URL)
*   **Components:**
    *   **Hero Section:** Value proposition ("Grow your workspace revenue").
    *   **Multi-step Form Wizard:**
        1.  **Personal Info:** Name, Email, Phone.
        2.  **Branch Info:** Branch Name, City, Address, Google Maps link.
        3.  **Space Details:** Checkboxes for what they offer (Hot Desk, Private Office, Meeting Rooms).
        4.  **Uploads:** Branch photos (drag & drop), Trade license.
    *   Success confirmation screen ("Application Submitted").
*   **Edge Cases:**
    *   Form validation errors → Highlight invalid fields with clear messages.
    *   File upload fails → Show retry option for specific file.

### Phase 1B: Invitation & Verification
**Goal:** Securely onboard an approved vendor into the platform.

*   **Trigger:** Admin approves application and sends an invitation email.
*   **User Actions:**
    *   Vendor receives invitation email.
    *   Clicks the onboarding link.
    *   Verifies email address.
    *   Sets a secure password.
*   **User Emotions:** Curious, Cautious, Ready to set up
*   **Pain Points:** Unclear invitation context, Password complexity frustration.
*   **Platform Experience:** Clean welcome screen, Clear branding, Simple password setup form.
*   **Strategic Outcome:** Vendor feels welcomed and guided into the platform.

#### Frontend Requirements
*   **Page:** `/vendor/onboard` (or invitation token-based URL)
*   **Components:**
    *   Welcome hero with AtSpaces branding
    *   Email verification status indicator
    *   Password creation form (with strength meter)
    *   "Get Started" CTA button
*   **Edge Cases:**
    *   Expired invitation link → Show expiry message + "Request New Invite" option.
    *   Already verified email → Redirect to login.
    
### Phase 1C: First-Time Capacity Setup (Mandatory)
**Goal:** Define the branch's initial capacity before it becomes bookable.

*   **User Actions:**
    *   Vendor is guided through a setup wizard.
    *   Defines capacity for each service type offered at their branch.
*   **User Emotions:** Focused, Methodical
*   **Pain Points:** Uncertainty about what each field means, Fear of setting wrong values.
*   **Platform Experience:** Step-by-step wizard with clear labels, Tooltips, Progress indicator.
*   **Strategic Outcome:** Branch becomes bookable immediately after setup.

#### Frontend Requirements
*   **Page:** `/vendor/setup` (wizard flow)
*   **Components:**
    *   Progress stepper (e.g., Step 1 of 3)
    *   **Hot Desk Setup:** Total seat count input, availability toggle
    *   **Private Office Setup:** Number of offices, size per office (capacity), availability toggle per office
    *   **Meeting Room Setup:** Number of rooms, capacity per room, working hours / time slot definition
    *   Summary confirmation screen before saving
    *   "Complete Setup" CTA
*   **Edge Cases:**
    *   Vendor skips setup → Branch stays in "Not Bookable" state. Show persistent banner: "Complete your setup to start receiving bookings."
    *   Vendor sets 0 capacity → Validation error: "Please set at least 1 unit."

---

## 2️⃣ Vendor Journey: Login & Authentication

### Phase: Secure Access
**Goal:** Quickly and securely access the vendor portal.

*   **User Actions:**
    *   Navigate to vendor login page.
    *   Enter email and password.
    *   Submit login form.
*   **User Emotions:** Routine, Expectation of speed
*   **Pain Points:** Forgotten password, Slow login.
*   **Platform Experience:** Minimal login form, "Remember Me" option, "Forgot Password" flow.
*   **Strategic Outcome:** Vendor accesses their dashboard within seconds.

#### Frontend Requirements
*   **Page:** `/vendor/login`
*   **Components:**
    *   Email input field
    *   Password input field (with show/hide toggle)
    *   "Remember Me" checkbox
    *   "Login" CTA button
    *   "Forgot Password?" link → triggers password reset flow
*   **Edge Cases:**
    *   Invalid credentials → Inline error: "Invalid email or password."
    *   Account locked (e.g., too many attempts) → Show lockout message + support contact.
    *   Session expired → Redirect to login with "Session expired" toast message.

---

## 3️⃣ Vendor Journey: Daily Overview (Dashboard)

### Phase: Morning Check-In
**Goal:** Get a quick snapshot of today's operations at a glance.

*   **User Actions:**
    *   Vendor lands on the dashboard after login.
    *   Reviews today's bookings count.
    *   Checks branch status indicator.
    *   Scans upcoming check-ins.
*   **User Emotions:** Focused, In control, Prepared
*   **Pain Points:** Information overload, Unclear priority actions.
*   **Platform Experience:** Clean summary cards, Status badge (Calm / Moderate / Busy), Today-focused data.
*   **Strategic Outcome:** Vendor feels prepared for the day in under 30 seconds.

#### Frontend Requirements
*   **Page:** `/vendor/dashboard`
*   **Components:**
    *   **Greeting Header:** "Good morning, [Vendor Name]" with date
    *   **Branch Status Badge:**
        *   🟢 **Calm** (< 50% booked)
        *   🟡 **Moderate** (50–80% booked)
        *   🔴 **Busy** (> 80% booked)
    *   **Today's Bookings Summary Card:**
        *   Total bookings count
        *   Breakdown by service type (Hot Desk / Private Office / Meeting Room)
    *   **Upcoming Check-Ins List:**
        *   Next 3–5 upcoming bookings
        *   Customer name, service type, time, check-in action button
    *   **Quick Action Buttons:**
        *   "Manage Capacity" shortcut
        *   "View All Bookings" shortcut
*   **Edge Cases:**
    *   No bookings today → Show empty state: "No bookings today. Your branch is available."
    *   Branch is paused → Show alert banner: "Your branch is currently paused. Contact admin to resume."

---

## 4️⃣ Vendor Journey: Capacity Management

### Phase 1: View Current Capacity
**Goal:** See the current setup and make minor availability adjustments.

*   **User Actions:**
    *   Navigate to Capacity Management section.
    *   View current capacity per service type.
    *   Toggle availability ON/OFF (instant action).
*   **User Emotions:** Analytical, In control
*   **Platform Experience:** Tabbed view per service type, Visual capacity meters.

### Phase 2: Request Capacity Changes (Modals) [FE-04]
**Goal:** Modify physical capacity via admin approval flow.

Because physical capacity changes (adding desks, removing rooms) impact live bookings and platform integrity, vendors must **submit requests** rather than instantly editing core capacity.

#### 4.1 Hot Desk Management
*   **User Actions:**
    *   Toggle instant availability (e.g., disable desks for cleaning).
    *   Click "Request Capacity Change" to add/remove total seats.
*   **Frontend Components:**
    *   Availability toggle (ON/OFF)
    *   Visual capacity bar (booked vs. available vs. total)
    *   **"Request Capacity Change" Modal:**
        *   Current Seats vs. Requested Seats inputs.
        *   Reason for change textarea.
        *   "Submit Request" button.

#### 4.2 Private Office Management
*   **User Actions:**
    *   Mark individual office availability status instantly (Available / Occupied / Maintenance).
    *   Click "Request Office Change" to add new office or resize/remove existing.
*   **Frontend Components:**
    *   Office list/grid view with status dropdowns.
    *   **"Request Add/Remove Office" Modal:**
        *   Type: Add New / Modify Existing / Remove.
        *   Office Details (Name, Capacity).
        *   Reason textarea.
        *   "Submit Request" button.

#### 4.3 Meeting Room Management
*   **User Actions:**
    *   Enable / disable specific time slots instantly.
    *   Click "Request Room Change" to add/remove rooms.
*   **Frontend Components:**
    *   Room list with capacity indicator
    *   Time slot grid (toggleable per slot)
    *   **"Request Room Change" Modal (Admin Approval Flow)**.

#### Frontend Requirements (Shared)
*   **Page:** `/vendor/capacity`
*   **Layout:** Tab-based navigation (Hot Desk | Private Office | Meeting Room)
*   **Components:**
    *   Service type tabs
    *   Live Availability Toggles
    *   **Capacity Change Modals (FE-04)**
    *   Pending Requests List (shows status of requests: Pending / Approved / Rejected)
*   **Edge Cases:**
    *   Vendor submits request while another is pending → Validation: "You already have a pending request for this service."
    *   Capacity reduced below existing bookings in a request → Request is flagged automatically for Admin review with warning.

---

## 5️⃣ Vendor Journey: Booking Oversight

### Phase 1: View Bookings
**Goal:** See all upcoming and past bookings for the branch.

*   **User Actions:**
    *   Navigate to Bookings section.
    *   Filter by date, service type, or status.
    *   View booking details.
*   **User Emotions:** Organized, Attentive
*   **Platform Experience:** Sortable and filterable table, Clear status labels.

### Phase 2: Check-In & No-Show Handling
**Goal:** Confirm arrivals and manage no-shows.

*   **User Actions:**
    *   Mark customer as "Checked In" upon arrival.
    *   Mark customer as "No-Show" after grace period.
*   **User Emotions:** Responsive, Accountable
*   **Platform Experience:** One-tap check-in, Clear no-show marking flow.

#### Frontend Requirements
*   **Page:** `/vendor/bookings`
*   **Components:**
    *   **Filter Bar:**
        *   Date picker (default: today)
        *   Service type dropdown (All / Hot Desk / Private Office / Meeting Room)
        *   Status filter (All / Upcoming / Checked-In / No-Show / Completed)
    *   **Bookings Table / List:**
        *   Columns: Customer Name, Service Type, Date & Time, Duration, Status, Actions
        *   Sortable by date/time
    *   **Action Buttons per Booking:**
        *   ✅ "Check In" → Changes status to Checked-In, shows confirmation toast
        *   ❌ "No-Show" → Changes status to No-Show, shows confirmation dialog
    *   **Booking Detail Modal (on row click):**
        *   Full booking information
        *   Customer phone number
        *   Payment status
        *   Check-in timestamp (if applicable)
*   **Edge Cases:**
    *   Late arrival → Vendor can still mark "Check In" manually.
    *   Customer cancels before arrival → Booking status updates automatically to "Cancelled."
    *   Double check-in attempt → Prevent with disabled state + tooltip: "Already checked in."

---

## 6️⃣ Vendor Journey: Reports & Analytics

### Phase: Performance Review
**Goal:** Understand branch performance and operational trends.

*   **User Actions:**
    *   Navigate to Reports section.
    *   Review occupancy overview.
    *   Check booking counts by period.
    *   Identify usage trends.
*   **User Emotions:** Reflective, Data-curious
*   **Pain Points:** Data overload, Unclear actionable insights.
*   **Platform Experience:** Simple visual charts, Key metrics highlighted, Trend indicators.
*   **Strategic Outcome:** Vendor makes informed capacity decisions based on real data.

#### Frontend Requirements
*   **Page:** `/vendor/reports`
*   **Components:**
    *   **Date Range Selector:** This week / This month / Custom range
    *   **Key Metrics Cards:**
        *   Total Bookings (with trend arrow ↑/↓)
        *   Average Occupancy Rate (%)
        *   No-Show Rate (%)
        *   Most Popular Service Type
    *   **Charts:**
        *   Occupancy over time (line or bar chart)
        *   Bookings by service type (pie/donut chart)
        *   Daily booking volume (bar chart)
    *   **Usage Trends Section:**
        *   Peak hours heatmap or summary
        *   Busiest days of the week
*   **Edge Cases:**
    *   New branch with no data → Show empty state: "Not enough data yet. Check back after your first week."
    *   Data loading error → Show retry message + "Contact support" link.

---

## End-to-End Emotional Curve

| Phase | Emotional State Shift |
| :--- | :--- |
| **Public Registration** | Aspirational → Professional |
| **Onboarding** | Curious → Confident |
| **Login** | Routine → Ready |
| **Daily Overview** | Uncertain → Prepared |
| **Capacity Mgmt** | Deliberate → In Control |
| **Booking Oversight** | Attentive → Responsive |
| **Reports** | Curious → Informed |

---

## Navigation Structure (Sidebar)

| Menu Item | Route | Icon Suggestion |
| :--- | :--- | :--- |
| Dashboard | `/vendor/dashboard` | 🏠 Home |
| Capacity | `/vendor/capacity` | ⚙️ Settings |
| Bookings | `/vendor/bookings` | 📋 List |
| Reports | `/vendor/reports` | 📊 Chart |
| Profile | `/vendor/profile` | 👤 User |

---

## KPIs Aligned With Vendor Journey

| Phase | KPI | Target |
| :--- | :--- | :--- |
| **Onboarding** | Setup completion rate | > 90% |
| **Daily Overview** | Time to first action | < 30 sec |
| **Capacity Mgmt** | Capacity accuracy | > 95% |
| **Booking Oversight** | Check-in completion rate | > 85% |
| **Booking Oversight** | No-show marking rate | > 90% |
| **Reports** | Report views per vendor/week | > 2 |

---

## Shared UI Patterns & Design Notes

### Component Library Needs
*   **Status Badges:** Calm (green), Moderate (amber), Busy (red), Paused (gray)
*   **Toggle Switches:** For availability on/off
*   **Number Steppers:** For capacity inputs
*   **Confirmation Dialogs:** For destructive or significant actions
*   **Toast Notifications:** For success/error feedback
*   **Empty States:** Illustrated with helpful copy for each section
*   **Loading Skeletons:** For data-heavy pages (bookings, reports)

### Design System & Repo Alignment
*   **Separate Repository / App:** This is a distinct web application from the customer frontend, though they connect to the same backend.
*   Use the AtSpaces brand color palette and typography from `brand.md`.
*   Dark mode support (consistent with customer-facing site).
*   RTL / Arabic support (AR default, EN optional).
*   Responsive layout: Desktop-first (vendors primarily use desktop), but tablet-friendly.

---

## MVP vs Future Enhancements

### MVP (Build Now)
*   ✅ Public "Become a Vendor" registration form (`/become-a-vendor`)
*   ✅ Vendor login (email + password)
*   ✅ Capacity setup wizard (first-time)
*   ✅ Capacity management view & availability toggles
*   ✅ Capacity change request modals (Add/Remove)
*   ✅ Daily overview dashboard
*   ✅ Booking list with check-in / no-show actions
*   ✅ Basic analytics (occupancy, booking count)

### Phase 2 (Future)
*   🔮 Predictive capacity suggestions (AI-driven)
*   🔮 Advanced reports with export (CSV / PDF)
*   🔮 Performance benchmarking across branches
*   🔮 Notification center (booking alerts, admin messages)
*   🔮 Vendor profile & settings page

---

## Final Strategic Summary

The AtSpaces vendor journey is designed to:
*   Minimize operational complexity
*   Provide real-time control over branch capacity
*   Surface actionable insights without data overload
*   Ensure smooth daily operations with one-tap actions
*   Maintain brand consistency across the platform

**Result:** A vendor experience that feels like a calm, professional operations dashboard — simple enough for daily use, powerful enough for informed decision-making.
