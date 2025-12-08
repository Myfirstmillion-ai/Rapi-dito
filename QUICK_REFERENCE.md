# Pay-to-Work Membership System - Quick Reference Card

## 🚀 Quick Start

### Environment Setup
```bash
# Add to .env file
SUPER_ADMIN_EMAIL=your-admin-email@rapidito.com
```

### Access Points
- **Admin Dashboard**: `http://localhost:5173/admin/dashboard`
- **WhatsApp Activation**: `https://wa.me/573232350038?text=Hola,%20quiero%20activar%20mi%20membresia%20de%20conductor`

---

## 🔑 API Endpoints

### GET /admin/captains
**Auth**: Required (JWT + Admin Email)
```bash
curl -X GET http://localhost:3000/admin/captains \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### PATCH /admin/captain/:id/status
**Auth**: Required (JWT + Admin Email)
```bash
curl -X PATCH http://localhost:3000/admin/captain/CAPTAIN_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isMembershipActive": true,
    "membershipPlan": "Monthly",
    "membershipExpiresAt": "2025-01-08T00:00:00.000Z"
  }'
```

---

## 📝 Database Schema

### Captain Model (New Fields)
```javascript
{
  isMembershipActive: Boolean,  // default: false
  membershipPlan: String,       // 'Weekly', 'Bi-Weekly', 'Monthly', '2-Months', '3-Months'
  membershipExpiresAt: Date     // null if inactive
}
```

---

## 🎨 Component Locations

### Backend
```
Backend/
├── models/captain.model.js           // Line 116-127 (membership fields)
├── controllers/captain.controller.js  // Line 90-97 (gatekeeper)
├── controllers/admin.controller.js    // NEW (admin logic)
├── middlewares/auth.middleware.js     // Line 51-96 (authAdmin)
├── routes/admin.routes.js            // NEW (admin routes)
└── server.js                          // Line 21, 72 (admin routes)
```

### Frontend
```
Frontend/src/
├── components/MembershipRequiredModal.jsx  // NEW (paywall)
├── screens/AdminDashboard.jsx              // NEW (admin UI)
├── screens/CaptainLogin.jsx                // Line 13, 38-45 (403 handler)
└── App.jsx                                 // Line 25, 169 (admin route)
```

---

## 🔧 Configuration

### WhatsApp Number
**File**: `Frontend/src/components/MembershipRequiredModal.jsx`
**Line**: 6
```javascript
const whatsappNumber = "573232350038"; // Change here
```

### Default Membership Plan
**File**: `Frontend/src/screens/AdminDashboard.jsx`
**Lines**: 20-23
```javascript
const MEMBERSHIP_CONFIG = {
  defaultPlan: "Monthly",
  defaultDurationDays: 30,
};
```

### Super Admin Emails
**File**: `Backend/middlewares/auth.middleware.js`
**Lines**: 65-68
```javascript
const SUPER_ADMIN_EMAILS = [
  process.env.SUPER_ADMIN_EMAIL || "admin@rapidito.com",
  // Add more emails here
];
```

### Available Plans
**File**: `Backend/models/captain.model.js`
**Line**: 115-116
```javascript
membershipPlan: {
  type: String,
  enum: ['Weekly', 'Bi-Weekly', 'Monthly', '2-Months', '3-Months', null],
  default: null,
},
```

---

## 🐛 Troubleshooting

### Issue: Admin cannot access dashboard
**Check**:
1. Email matches `SUPER_ADMIN_EMAIL` in .env
2. JWT token is valid
3. Token is sent in Authorization header

### Issue: 403 modal not showing
**Check**:
1. Error response has status 403
2. Error response has `error: "MEMBERSHIP_REQUIRED"`
3. MembershipRequiredModal is imported in CaptainLogin

### Issue: Toggle not updating status
**Check**:
1. Admin token is valid
2. Network request succeeds
3. Check browser console for errors
4. Verify captain ID is correct

### Issue: Driver can't login after activation
**Check**:
1. `isMembershipActive` is `true` in database
2. Membership hasn't expired
3. Clear browser cache and try again

---

## 📊 Testing Checklist

- [ ] New driver signup → isMembershipActive = false
- [ ] Inactive driver login → 403 error
- [ ] 403 error → Modal displays
- [ ] WhatsApp button → Opens correct link
- [ ] Admin login → Dashboard accessible
- [ ] Search drivers → Filters correctly
- [ ] Toggle switch → Updates status
- [ ] Active driver login → Success

---

## 🎯 Key Files to Review

1. **PAY_TO_WORK_MEMBERSHIP_GUIDE.md** - Full implementation guide
2. **SECURITY_SUMMARY_MEMBERSHIP.md** - Security analysis
3. **UI_VISUAL_GUIDE.md** - Design specifications
4. **IMPLEMENTATION_COMPLETE.md** - Final summary

---

## 📞 Important Values

| Item | Value |
|------|-------|
| WhatsApp Number | 573232350038 |
| Default Plan | Monthly |
| Default Duration | 30 days |
| Admin Route | /admin/dashboard |
| Error Code | MEMBERSHIP_REQUIRED |
| HTTP Status | 403 |

---

## 🔐 Security Notes

✅ JWT authentication required
✅ Super admin email whitelist
✅ Server-side validation
✅ Default deny (inactive by default)
⚠️ Add rate limiting (recommended)
⚠️ Monitor admin actions

---

## 🎨 Color Reference

| Element | Color |
|---------|-------|
| Active Badge | Emerald-500/20 bg, Emerald-300 text |
| Inactive Badge | Red-500/20 bg, Red-300 text |
| Toggle Active | Emerald-500 |
| Toggle Inactive | White/20 |
| Modal Gradient | Red-Orange-Yellow |
| WhatsApp Button | Green-500 → Emerald-500 |

---

## 📱 Routes

| Route | Access | Description |
|-------|--------|-------------|
| /captain/login | Public | Driver login page |
| /captain/signup | Public | Driver registration |
| /admin/dashboard | Admin Only | Admin management panel |
| GET /admin/captains | Admin API | Fetch all drivers |
| PATCH /admin/captain/:id/status | Admin API | Update membership |

---

**Version**: 1.0.0  
**Last Updated**: December 8, 2024  
**Status**: Production Ready ✅
