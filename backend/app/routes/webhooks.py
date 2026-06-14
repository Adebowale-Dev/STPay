import json

from fastapi import APIRouter, Depends, HTTPException, Request
from pymongo.database import Database

from app.database import get_db
from app.services.paystack_service import PaystackService
from app.services.wallet_service import WalletService


router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/paystack", include_in_schema=False)
async def paystack_webhook(request: Request, db: Database = Depends(get_db)) -> dict:
    body = await request.body()
    signature = request.headers.get("x-paystack-signature")
    if not PaystackService().verify_webhook_signature(body, signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature.")

    payload = json.loads(body)
    event = payload.get("event")
    data = payload.get("data") or {}
    reference = data.get("reference")
    if not reference:
        return {"received": True}

    service = WalletService(db)
    if event == "transfer.success":
        service.complete_external_transfer(reference)
    elif event in {"transfer.failed", "transfer.reversed"}:
        service.refund_external_transfer(reference, data.get("reason") or event)
    return {"received": True}
