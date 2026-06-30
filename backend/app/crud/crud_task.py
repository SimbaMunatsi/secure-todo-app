from typing import Any, List

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import Task
from app.schemas.task import TaskCreate, TaskUpdate


def get_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Task]:
    return db.scalars(
        select(Task)
        .where(Task.user_id == user_id)
        .offset(skip)
        .limit(limit)
    ).all()


def get_task(db: Session, task_id: int, user_id: int) -> Task | None:
    return db.scalar(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == user_id)
    )


def create_task(db: Session, task_in: TaskCreate, user_id: int) -> Task:
    db_task = Task(**task_in.model_dump(), user_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, db_task: Task, task_in: TaskUpdate) -> Task:
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, db_task: Task) -> None:
    db.delete(db_task)
    db.commit()
