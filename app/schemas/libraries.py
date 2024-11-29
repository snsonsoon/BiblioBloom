from pydantic import BaseModel
from typing import List

# Define the schema for the library response
class LibraryResponse(BaseModel):
    library_id: int
    library_name: str
    address: str
    homepage: str | None  # Optional field

    class Config:
        orm_mode = True