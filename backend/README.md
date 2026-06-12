# STPay Backend

STPay is a FastAPI and MongoDB backend for a secure digital wallet and online banking system. It includes JWT authentication, Brevo email flows, wallet operations, beneficiary management, notifications, and admin controls.

## Stack

- FastAPI
- MongoDB
- PyMongo
- JWT authentication
- Passlib bcrypt hashing
- Brevo email API

## Setup

1. Activate your virtual environment.
2. Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and fill in your MongoDB, JWT, frontend, and Brevo values.
4. Start MongoDB locally or use a MongoDB Atlas connection string in `.env`.
5. Seed the default admin user:

```powershell
python seed_admin.py
```

6. Seed the default demo customer:

```powershell
python seed_user.py
```

7. Start the API:

```powershell
python -m uvicorn main:app --reload
```

## Example Environment

```env
MONGODB_URL=mongodb://localhost:27017/stpay
MONGODB_DB_NAME=stpay
SECRET_KEY=change-this-to-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=STPay
FRONTEND_URL=http://localhost:3000
```

## Default Admin

- Email: `admin@gmail.com`
- Password: `123456789`
- Role: `admin`

Running `python seed_admin.py` again updates the existing admin account to these
credentials and preserves its wallet.

## Default Demo User

- Email: `adebowale235@gmail.com`
- Password: `123456789`
- Transaction PIN: `1234`
- Role: `user`

Running `python seed_user.py` again updates the existing demo customer to these
credentials and preserves its wallet balance.

## Main Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/verify-email`
- `POST /auth/resend-verification-code`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/change-password`
- `PATCH /users/change-transaction-pin`
- `GET /wallet/balance`
- `POST /wallet/fund`
- `POST /wallet/transfer`
- `POST /airtime/buy`
- `POST /bills/pay`
- `GET /transactions`
- `GET /transactions/{reference}`
- `GET /beneficiaries`
- `POST /beneficiaries`
- `DELETE /beneficiaries/{id}`
- `GET /notifications`
- `PATCH /notifications/{id}/read`
- `GET /admin/users`
- `GET /admin/users/{id}`
- `GET /admin/transactions`
- `GET /admin/stats`
- `PATCH /admin/users/{id}/freeze`
- `PATCH /admin/users/{id}/unfreeze`

## Notes

- Wallet funding, airtime purchases, and bill payments are simulated.
- All sensitive values are read from environment variables.
- Email delivery is implemented with the Brevo API.
- MongoDB multi-document transactions require a replica set in production if you want strict atomic transfer guarantees.
