# AtSpaces: Product Overview & Core Journeys

## 1. Product Overview
**AtSpaces** is a multi-branch workspace booking platform designed to connect users with flexible workspaces across Jordan through a calm, brand-led, and intelligent digital experience.

The platform operates through three core account types:
*   **Customer:** Discovers, books, and pays for workspaces.
*   **Vendor:** Manages branch capacity and daily operations.
*   **Admin:** Oversees the entire network, pricing, policies, and strategic decisions.

The system is designed to scale to 500+ branches, while maintaining a consistent brand experience and centralized control.

---

## 2. Core Services
AtSpaces offers three primary workspace services:

### 2.1 Hot Desk
*   Shared flexible seating
*   Booked daily, weekly, or monthly
*   Capacity-based availability

### 2.2 Private Office
*   Enclosed private offices
*   Booked weekly or monthly (daily if available)
*   Unit-based availability

### 2.3 Meeting Room
*   Hourly or full-day booking
*   Time-slot-based availability
*   Capacity defined per room

---

## 3. Account Types & Roles

### 3.1 Customer Account
*   **Purpose:** Simple discovery, booking, and payment.
*   **Key Characteristics:**
    *   No login required for browsing.
    *   Login required only at the booking/payment stage.
    *   Login method: Jordanian phone number + OTP.

### 3.2 Vendor Account
*   **Purpose:** Manage branch capacity and daily operations.
*   **Key Characteristics:**
    *   Email + password login.
    *   Manages physical reality (capacity & availability).
    *   Cannot control pricing or policies.

### 3.3 Admin Account
*   **Purpose:** Strategic control of the entire network.
*   **Key Characteristics:**
    *   Full visibility across branches and vendors.
    *   Controls pricing, policies, approvals, and analytics.
    *   Data-driven decision-making interface.

---

## 4. Customer User Journey (Detailed)

### 4.1 Discovery Phase
*   User enters the website.
*   Chooses service type (Hot Desk / Private Office / Meeting Room).
*   Browses branches via list or interactive map.

### 4.2 Recommendation Phase
*   User interacts with AI chat agent.
*   Chat collects: Location, Time, Duration.
*   AI recommends best-matched branch.

### 4.3 Booking Phase
*   User selects branch, service, and duration.
*   System calculates total price (JOD).

### 4.4 Authentication
*   User enters Jordanian phone number (+962).
*   OTP verification.

### 4.5 Payment
*   Payment methods: Apple Pay, Visa, MasterCard.
*   Payment can occur directly inside chat.

### 4.6 Confirmation
*   Booking confirmation.
*   Calendar add.
*   Directions to branch.

---

## 5. Vendor User Journey (Detailed)

### 5.1 Login
*   Vendor logs in via email/password.

### 5.2 Daily Overview
*   Sees today's bookings.
*   Branch status (Calm / Moderate / Busy).

### 5.3 Capacity Management
*   **Hot Desk:** Define total seat count, enable/disable availability, temporary pause with duration.
*   **Private Office:** Define number of offices, set size per office, mark availability status.
*   **Meeting Room:** Define room capacity, enable/disable time slots.

### 5.4 Booking Oversight
*   View upcoming bookings.
*   Check-in users.
*   Mark no-shows.

### 5.5 Reports
*   Occupancy overview.
*   Booking count.
*   Usage trends.

---

## 6. Admin User Journey (Detailed)

### 6.1 Global Overview
*   Total bookings.
*   Network occupancy.
*   Active branches.

### 6.2 Network Analytics
*   Occupancy by city.
*   Service usage distribution.
*   Peak hours.

### 6.3 Branch Management
*   View all branches.
*   Branch status (Active / Paused / Review).
*   Branch-level analytics.

### 6.4 Vendor Management
*   Vendor list.
*   Vendor reliability indicators.

### 6.5 Pricing & Policies
*   Control service pricing.
*   Define cancellation rules.
*   Booking limits.

### 6.6 Approvals
*   Capacity change approvals.
*   Branch pause approvals.

### 6.7 Admin Settings
*   Profile & security.
*   Notifications.
*   Permissions.
*   Activity log.

---

## 7. Lean Canvas — AtSpaces

*   **Problem:** Fragmented workspace discovery, inconsistent pricing and experience, manual branch coordination.
*   **Customer Segments:** Freelancers, Startups, Remote teams, Branch operators.
*   **Unique Value Proposition:** "One calm platform to discover, book, and manage workspaces across Jordan."
*   **Solution:** AI-powered booking assistant, centralized capacity management, brand-consistent experience.
*   **Channels:** Website, Organic search, Partnerships.
*   **Revenue Streams:** Booking commission, Subscription plans (future).
*   **Cost Structure:** Platform development, Infrastructure, Support.
*   **Key Metrics:** Occupancy rate, Booking conversion, Active branches.
*   **Unfair Advantage:** Network scale, Centralized control, Brand-led UX.

---

## 8. MVP Features (Per Account)

### Customer MVP
*   Service browsing
*   Map-based discovery
*   AI chat booking
*   OTP login
*   Apple Pay / Cards

### Vendor MVP
*   Capacity setup
*   Availability toggles
*   Booking list
*   Basic analytics

### Admin MVP
*   Network overview
*   Branch & vendor list
*   Pricing control
*   Approvals

---

## 9. Future Improvements & Enhancements

### Customer Enhancements
*   Saved preferences
*   Membership plans
*   Loyalty rewards

### Vendor Enhancements
*   Predictive capacity suggestions
*   Advanced reports
*   Performance benchmarking

### Admin Enhancements
*   AI-driven strategic insights
*   Pricing simulations
*   Regional expansion tools

---

## 10. Final Vision
AtSpaces is not just a booking platform. It is a calm operating system for flexible workspaces, designed to scale, adapt, and feel human at every interaction.

The system balances:
*   Centralized control
*   Local flexibility
*   Brand consistency
*   Data-driven decisions

---

## 11. Detailed Flows & Edge Cases (Very Detailed)

### 11.1 Customer Flows — Deep Dive

**11.1.1 Entry & Discovery**
*   User lands on AtSpaces website.
*   No login wall.
*   Chooses language (AR default / EN optional).
*   Sees three primary services clearly separated.
*   *Edge cases:* User denies location access → system falls back to city selector. User switches language mid-flow → selections persist.

**11.1.2 Map-Based Discovery Flow**
*   User opens map view.
*   System requests location.
*   Nearby branches highlighted.
*   Pins indicate availability state.
*   *Edge cases:* No nearby branches → AI suggests expanding radius. Branch temporarily paused → shown as inactive pin.

**11.1.3 Chat-Based Booking Flow (Primary)**
*   User opens AI chat.
*   AI asks structured questions: Location, Service type, Date & time, Duration.
*   AI calculates price and availability.
*   *Edge cases:* Requested time unavailable → AI proposes alternatives. Multiple branches match → AI ranks by distance & availability.

**11.1.4 Authentication Flow**
*   Triggered only at booking/payment.
*   Phone number validation (+962).
*   OTP verification.
*   *Edge cases:* OTP expired → resend flow. Wrong OTP → gentle retry messaging.

**11.1.5 Payment Flow**
*   Apple Pay (priority).
*   Visa / MasterCard fallback.
*   *Edge cases:* Payment failure → retry or switch method. Payment success but booking fails → auto-refund logic.

### 11.2 Vendor Flows — Deep Dive

**11.2.1 Vendor Onboarding**
*   Vendor invited by Admin.
*   Email verification.
*   First-time capacity setup (mandatory).
*   *Edge cases:* Capacity not set → branch not bookable.

**11.2.2 Capacity Definition Flow**
*   **Hot Desk:** Vendor sets total seat count, system auto-calculates availability.
*   **Private Office:** Vendor defines office units and sizes.
*   **Meeting Rooms:** Vendor defines rooms and working hours.
*   *Edge cases:* Vendor attempts extreme capacity change → approval required.

**11.2.3 Daily Operations**
*   Vendor checks bookings.
*   Performs check-ins.
*   Marks no-shows.
*   *Edge cases:* User late arrival → vendor marks arrived manually.

### 11.3 Admin Flows — Deep Dive

**11.3.1 Network Monitoring Flow**
*   Admin lands on global overview.
*   Sees alerts and anomalies.
*   *Edge cases:* Sudden drop in occupancy → alert triggered.

**11.3.2 Pricing Change Flow**
*   Admin edits pricing.
*   System simulates impact.
*   Confirmation required.
*   *Edge cases:* High-impact change → double confirmation.

**11.3.3 Approvals Flow**
*   Vendor submits capacity change request.
*   Admin reviews impact summary.
*   Approves / rejects.

---

## 12. KPIs & Success Metrics (Per Account)

*   **Customer KPIs:** Booking conversion rate, Time to booking completion, Chat completion rate.
*   **Vendor KPIs:** Capacity accuracy, Check-in completion rate, No-show rate.
*   **Admin KPIs:** Network occupancy, Branch health score, Vendor reliability index.

---

## 13. MVP vs Phase 2 vs Phase 3 (Detailed)

*   **MVP:** Core booking, Capacity management, Basic analytics.
*   **Phase 2:** AI optimization, Advanced reports, Subscriptions.
*   **Phase 3:** Predictive analytics, Dynamic pricing, Regional expansion.

---

## 14. Technical & Product Assumptions
*   Centralized pricing engine.
*   Real-time availability sync.
*   Secure payment processing.

---

## 15. Risks & Mitigation
*   **Risk:** Overbooking
    *   *Mitigation:* Hard capacity limits.
*   **Risk:** Vendor misuse
    *   *Mitigation:* Approval flows.

---

## 16. Long-Term Vision
AtSpaces evolves into a national workspace operating system that balances:
*   Human-centered UX
*   Brand consistency
*   Data-driven intelligence
