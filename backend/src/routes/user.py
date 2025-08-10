from fastapi import APIRouter, HTTPException, Body, Depends
from src.models.chat import User
from src.db import SessionLocal
from src.db.chat_models import User as UserDB
from src.auth.auth_utils import create_access_token, get_current_user
from passlib.context import CryptContext

router = APIRouter(prefix="/api/user", tags=["User"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/login")
def login(user: dict):
    db = SessionLocal()
    db_user = db.query(UserDB).filter_by(email=user["email"]).first()
    db.close()
    if (
        not db_user
        or not db_user.password_hash
        or not verify_password(user["password"], db_user.password_hash)
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(db_user.user_id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/complete-registration")
def complete_user_registration(user_data: dict):
    """
    Complete user registration with data from frontend onboarding flow
    """

    db = SessionLocal()

    # Extract data from the request
    email = user_data.get("email")
    name = user_data.get("name")
    location = user_data.get("location")
    preferred_language = user_data.get("preferred_language")
    user_type = user_data.get("user_type")
    years_experience = user_data.get("years_experience")
    main_goal = user_data.get("main_goal")
    crops_grown = user_data.get("crops_grown", [])
    password = user_data.get("password")

    # Validate required fields
    if not email or not password:
        db.close()
        raise HTTPException(status_code=400, detail="Email and password are required")

    # Check if user already exists
    existing = db.query(UserDB).filter_by(email=email).first()
    if existing:
        db.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    # Convert crops_grown array to comma-separated string for database storage
    crops_grown_str = ",".join(crops_grown) if crops_grown else ""

    # Convert years_experience to integer if provided
    years_experience_int = None
    if years_experience is not None:
        try:
            years_experience_int = int(years_experience)
        except (ValueError, TypeError):
            years_experience_int = None

    db_user = UserDB(
        name=name,
        email=email,
        location=location,
        preferred_language=preferred_language,
        crops_grown=crops_grown_str,
        user_type=user_type,
        years_experience=years_experience_int,
        main_goal=main_goal,
        password_hash=hash_password(password),
    )

    print("💾 Saving user to database:")
    print(f"🆔 User ID: {db_user.user_id}")
    print(f"📧 Email: {db_user.email}")
    print(f"👤 Name: {db_user.name}")
    print(f"📍 Location: {db_user.location}")
    print(f"🌐 Preferred Language: {db_user.preferred_language}")
    print(f"👨‍🌾 User Type: {db_user.user_type}")
    print(f"📅 Years Experience: {db_user.years_experience}")
    print(f"🎯 Main Goal: {db_user.main_goal}")
    print(f"🌾 Crops Grown (DB): {db_user.crops_grown}")
    print("=" * 50)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.close()

    # Convert back to array for API response
    crops_grown_array = db_user.crops_grown.split(",") if db_user.crops_grown else []

    # Create access token for the newly registered user
    access_token = create_access_token(db_user.user_id)

    return {
        "user": User(
            user_id=db_user.user_id,
            name=db_user.name,
            email=db_user.email,
            location=db_user.location,
            preferred_language=db_user.preferred_language,
            crops_grown=crops_grown_array,
            user_type=db_user.user_type,
            years_experience=db_user.years_experience,
            main_goal=db_user.main_goal,
            created_at=db_user.created_at,
            updated_at=db_user.updated_at,
        ),
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me")
def get_current_user_profile(current_user=Depends(get_current_user)):
    # current_user is now the actual User object from the database
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Convert crops_grown string to array for API response
    crops_grown_array = (
        current_user.crops_grown.split(",") if current_user.crops_grown else []
    )

    return User(
        user_id=current_user.user_id,
        name=current_user.name,
        email=current_user.email,
        location=current_user.location,
        preferred_language=current_user.preferred_language,
        crops_grown=crops_grown_array,
        user_type=current_user.user_type,
        years_experience=current_user.years_experience,
        main_goal=current_user.main_goal,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )


@router.get("/{user_id}")
def get_user(user_id: str, current_user=Depends(get_current_user)):
    db = SessionLocal()
    db_user = db.query(UserDB).filter_by(user_id=user_id).first()
    db.close()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Convert crops_grown string to array for API response
    crops_grown_array = db_user.crops_grown.split(",") if db_user.crops_grown else []

    return User(
        user_id=db_user.user_id,
        name=db_user.name,
        email=db_user.email,
        location=db_user.location,
        preferred_language=db_user.preferred_language,
        crops_grown=crops_grown_array,
        user_type=db_user.user_type,
        years_experience=db_user.years_experience,
        main_goal=db_user.main_goal,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at,
    )


@router.patch("/{user_id}")
def update_user(
    user_id: str, user_data: dict = Body(...), current_user=Depends(get_current_user)
):
    print(f"🌱 Updating user {user_id}")
    print(f"📧 Received data: {user_data}")
    print(f"🔐 Current user: {current_user.user_id if current_user else 'None'}")
    print(f"🎯 Target user: {user_id}")

    # Check if current user is trying to update their own profile
    if current_user.user_id != user_id:
        print(f"❌ Authorization failed: {current_user.user_id} != {user_id}")
        raise HTTPException(
            status_code=403, detail="Not authorized to update this user"
        )

    db = SessionLocal()
    db_user = db.query(UserDB).filter_by(user_id=user_id).first()
    if not db_user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    # Convert crops_grown array to string for database storage
    if "crops_grown" in user_data and isinstance(user_data["crops_grown"], list):
        user_data["crops_grown"] = ",".join(user_data["crops_grown"])
        print(f"🌾 Converted crops_grown to: {user_data['crops_grown']}")

    print(f"💾 Saving to database: {user_data}")

    for field, value in user_data.items():
        if hasattr(db_user, field):
            setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)

    print(f"✅ Updated user data:")
    print(f"   Name: {db_user.name}")
    print(f"   Location: {db_user.location}")
    print(f"   Preferred Language: {db_user.preferred_language}")
    print(f"   User Type: {db_user.user_type}")
    print(f"   Years Experience: {db_user.years_experience}")
    print(f"   Main Goal: {db_user.main_goal}")
    print(f"   Crops Grown: {db_user.crops_grown}")

    db.close()

    # Convert back to array for API response
    crops_grown_array = db_user.crops_grown.split(",") if db_user.crops_grown else []

    return User(
        user_id=db_user.user_id,
        name=db_user.name,
        email=db_user.email,
        location=db_user.location,
        preferred_language=db_user.preferred_language,
        crops_grown=crops_grown_array,
        user_type=db_user.user_type,
        years_experience=db_user.years_experience,
        main_goal=db_user.main_goal,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at,
    )


@router.delete("/{user_id}")
def delete_user(user_id: str, current_user=Depends(get_current_user)):
    db = SessionLocal()
    db_user = db.query(UserDB).filter_by(user_id=user_id).first()
    if not db_user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    db.close()
    return {"detail": "User deleted successfully"}
