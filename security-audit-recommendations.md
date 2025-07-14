# 🔒 La Casita Security Audit & Recommendations

## 🚨 CRITICAL SECURITY ISSUES

### 1. Security Definer View (IMMEDIATE FIX REQUIRED)
**Issue**: `public.order_details` view bypasses RLS policies
**Risk**: Users can access unauthorized order data
**Fix**: Replace with `security_invoker=true` view

```sql
-- IMMEDIATE FIX REQUIRED
DROP VIEW IF EXISTS public.order_details;
CREATE VIEW public.order_details
WITH (security_invoker=true)
AS
SELECT 
  o.id,
  o.customer_id,
  o.total_price,
  o.status,
  o.created_at,
  o.notes
FROM orders o
WHERE 
  -- Only show orders to authorized users
  auth.uid() = o.customer_id OR 
  auth.jwt() ->> 'role' IN ('admin', 'kitchen');
```

## 🛡️ RECOMMENDED SECURITY IMPROVEMENTS

### 2. Row Level Security (RLS) Policies
Ensure all tables have proper RLS policies:

```sql
-- Orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON orders
FOR SELECT USING (
  auth.uid() = customer_id OR 
  auth.jwt() ->> 'role' IN ('admin', 'kitchen')
);

CREATE POLICY "Users can insert their own orders" ON orders
FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON customers
FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" ON customers
FOR UPDATE USING (auth.uid() = auth_id);
```

### 3. API Security Headers
Add security headers to API routes:

```javascript
// Add to all API routes
export async function GET/POST(request) {
  const response = NextResponse.json(data);
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}
```

### 4. Input Validation & Sanitization
```javascript
// Add to all form handlers
const sanitizeInput = (input) => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Validate all inputs
const validateOrderData = (data) => {
  if (!data.customerInfo?.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('Invalid email format');
  }
  // Add more validations...
};
```

### 5. Rate Limiting
```javascript
// Add rate limiting to sensitive endpoints
const rateLimiter = new Map();

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10;
  
  const requests = rateLimiter.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  
  rateLimiter.set(ip, [...recentRequests, now]);
  // Continue with request...
}
```

## 🔐 AUTHENTICATION & AUTHORIZATION

### 6. Strengthen JWT Validation
```javascript
// Add to middleware
export async function middleware(request) {
  const token = request.cookies.get('supabase-auth-token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token.value);
    if (error || !user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}
```

### 7. Role-Based Access Control
```javascript
// Add role checking middleware
const requireRole = (allowedRoles) => {
  return async (request) => {
    const user = await getCurrentUser(request);
    const userRole = user?.app_metadata?.role || 'customer';
    
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
  };
};

// Usage in admin routes
export const GET = requireRole(['admin', 'kitchen'])(async (request) => {
  // Admin/kitchen only logic
});
```

## 💳 PAYMENT SECURITY

### 8. Secure Payment Handling
```javascript
// Never store payment details
const processPayment = async (paymentData) => {
  // Only send to Square, never store locally
  const result = await squareClient.paymentsApi.createPayment({
    sourceId: paymentData.sourceId,
    amountMoney: {
      amount: paymentData.amount,
      currency: 'USD'
    },
    // Never log or store card details
  });
  
  // Only store payment ID and status
  return {
    paymentId: result.payment.id,
    status: result.payment.status
  };
};
```

## 🗄️ DATABASE SECURITY

### 9. Environment Variables Security
```bash
# Ensure these are properly secured
SUPABASE_SERVICE_ROLE_KEY=*** # Never expose in client
SQUARE_ACCESS_TOKEN=*** # Production token
SQUARE_APPLICATION_ID=*** # Production ID
DATABASE_URL=*** # Secure connection string
```

### 10. Backup & Recovery
```sql
-- Set up automated backups
-- Enable point-in-time recovery
-- Test restore procedures regularly
```

## 📊 MONITORING & LOGGING

### 11. Security Monitoring
```javascript
// Add security event logging
const logSecurityEvent = (event, details) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: request.headers.get('x-forwarded-for'),
    userAgent: request.headers.get('user-agent')
  }));
};

// Log suspicious activities
if (failedLoginAttempts > 5) {
  logSecurityEvent('SUSPICIOUS_LOGIN_ATTEMPTS', { attempts: failedLoginAttempts });
}
```

## 🚀 IMMEDIATE ACTION ITEMS

### Priority 1 (Fix Immediately)
- [ ] Fix `order_details` view security definer issue
- [ ] Enable RLS on all tables
- [ ] Add input validation to all forms
- [ ] Implement rate limiting on auth endpoints

### Priority 2 (This Week)
- [ ] Add security headers to all API routes
- [ ] Implement role-based access control
- [ ] Set up security monitoring
- [ ] Review and secure environment variables

### Priority 3 (Next Week)
- [ ] Implement comprehensive logging
- [ ] Set up automated security scanning
- [ ] Create incident response plan
- [ ] Regular security audits

## 🎯 COMPLIANCE CHECKLIST

- [ ] PCI DSS compliance for payment processing
- [ ] GDPR compliance for customer data
- [ ] Regular security assessments
- [ ] Employee security training
- [ ] Data retention policies
- [ ] Incident response procedures

---

**Remember**: Security is an ongoing process, not a one-time fix. Regular audits and updates are essential for maintaining a secure application.
