from fastapi import APIRouter, HTTPException, status
from app.models.decision_models import DecisionRequest, DecisionResponse, ChatFollowUpRequest, ChatFollowUpResponse
from app.services.gemini_service import gemini_service
from app.utils.logger import logger

router = APIRouter(prefix="/api", tags=["Decision Intelligence"])


@router.post(
    "/analyze-decision",
    response_model=DecisionResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Business Decision",
    description="Evaluates a business decision through Gemini 3.8 Flash and returns an executive strategic recommendation with pros, cons, alternatives, risk level, and confidence gauge."
)
async def analyze_decision(payload: DecisionRequest) -> DecisionResponse:
    try:
        logger.info(f"Incoming analysis request for decision: '{payload.decision[:60]}...'")
        result = gemini_service.analyze_decision(payload)
        return result
    except ValueError as ve:
        logger.warning(f"Validation or configuration error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Internal server error processing decision: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Strategic analysis engine encountered a temporary processing error. Please verify your connection or try again."
        )


@router.post(
    "/chat-followup",
    response_model=ChatFollowUpResponse,
    status_code=status.HTTP_200_OK,
    summary="Executive Follow-up Advisor",
    description="Provides real-time strategic counsel to executive questions regarding evaluated decisions."
)
async def chat_followup(payload: ChatFollowUpRequest) -> ChatFollowUpResponse:
    try:
        logger.info(f"Follow-up question received: '{payload.question[:60]}...'")
        answer = gemini_service.chat_followup(
            question=payload.question,
            decision=payload.decision or "",
            recommendation=payload.recommendation or "",
            reasoning=payload.reasoning or ""
        )
        return ChatFollowUpResponse(answer=answer, model_used="gemini-3.8-flash")
    except Exception as e:
        logger.error(f"Error in chat-followup: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Strategic advisor encountered a processing error. Please try again."
        )
