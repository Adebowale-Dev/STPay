from fastapi import APIRouter, Depends, HTTPException
from pymongo import DESCENDING
from pymongo.database import Database

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.beneficiary import BeneficiaryCreateRequest, BeneficiaryResponse
from app.utils.mongo import generate_id, serialize_documents, utc_now


router = APIRouter(prefix="/beneficiaries", tags=["Beneficiaries"])


@router.get("")
def list_beneficiaries(
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    beneficiaries = serialize_documents(
        db.beneficiaries.find({"user_id": current_user["id"]}).sort("created_at", DESCENDING)
    )
    return {
        "success": True,
        "message": "Beneficiaries fetched successfully.",
        "data": [BeneficiaryResponse.model_validate(item).model_dump() for item in beneficiaries],
    }


@router.post("")
def add_beneficiary(
    payload: BeneficiaryCreateRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    beneficiary = {
        "id": generate_id(),
        "user_id": current_user["id"],
        **payload.model_dump(),
        "created_at": utc_now(),
    }
    db.beneficiaries.insert_one(beneficiary)
    return {
        "success": True,
        "message": "Beneficiary added successfully.",
        "data": BeneficiaryResponse.model_validate(beneficiary).model_dump(),
    }


@router.delete("/{beneficiary_id}")
def delete_beneficiary(
    beneficiary_id: str,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    beneficiary = db.beneficiaries.find_one({"id": beneficiary_id, "user_id": current_user["id"]})
    if beneficiary is None:
        raise HTTPException(status_code=404, detail="Beneficiary not found.")
    db.beneficiaries.delete_one({"id": beneficiary_id})
    return {"success": True, "message": "Beneficiary deleted successfully.", "data": None}
