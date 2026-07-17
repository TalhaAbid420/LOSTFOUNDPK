"""
Shared utilities for Pydantic/MongoDB models.

Provides PyObjectId – a custom type that lets Pydantic v2 serialise
MongoDB's bson.ObjectId to a plain string in JSON responses while still
accepting both ObjectId and string values on input.
"""

from bson import ObjectId
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema


class PyObjectId(str):
    """Pydantic-compatible wrapper around bson.ObjectId.

    - Serialises to a plain string in JSON.
    - Validates both ObjectId instances and 24-char hex strings.
    """

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: type, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.no_info_plain_validator_function(
            cls.validate,
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def validate(cls, value: object) -> "PyObjectId":
        if isinstance(value, ObjectId):
            return cls(str(value))
        if isinstance(value, str) and ObjectId.is_valid(value):
            return cls(value)
        raise ValueError(f"Invalid ObjectId: {value!r}")

    def __repr__(self) -> str:  # pragma: no cover
        return f"PyObjectId({super().__repr__()})"
