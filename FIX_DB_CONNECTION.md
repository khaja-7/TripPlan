# CRITICAL: Database Connection Failure (IPv6 Issue)

The connection `db.dtzgnoftasghplvogrxf.supabase.co` is **failing** because it is an **IPv6-only address** and your computer/network only supports IPv4.

**The command `ping` just failed to find this host.**

## REQUIRED Solution: Use the Connection Pooler

You MUST get the **IPv4** connection string from Supabase. It uses a **different host** (usually `aws-0...pooler.supabase.com`) and port (`6543`).

### Step-by-Step Instructions:

1.  Log in to your **Supabase Dashboard** (https://supabase.com/dashboard/project/dtzgnoftasghplvogrxf).
2.  Go to **Settings** (Look for the Cog icon ⚙️ at the bottom left).
3.  Click on **Database**.
4.  Scroll down to the **Connection Pooling** section.
5.  **Copy the URI**.
    *   It looks like: `postgres://postgres.dtzgnoftasghplvogrxf:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`
    *   Notice the port is **6543**.
6.  Paste that exact string here.
    *   I will fix the password encoding for you. Just paste the string you copy.
