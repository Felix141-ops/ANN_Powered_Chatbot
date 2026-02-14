"""add user_id to predictions

Revision ID: d93bb6b5bf1e
Revises: 09e80e298588
Create Date: 2026-02-14 11:53:47.184734

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd93bb6b5bf1e'
down_revision: Union[str, Sequence[str], None] = '09e80e298588'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('predictions', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_predictions_user_id', 'predictions', 'users', ['user_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('fk_predictions_user_id', 'predictions', type_='foreignkey')
    op.drop_column('predictions', 'user_id')
