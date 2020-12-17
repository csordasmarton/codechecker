"""Git blame info

Revision ID: ad2a567e513a
Revises: af5d8a21c1e4
Create Date: 2020-12-17 18:08:50.322381

"""

# revision identifiers, used by Alembic.
revision = 'ad2a567e513a'
down_revision = 'af5d8a21c1e4'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('file_contents',
                  sa.Column('blame_info', sa.Binary(), nullable=True))


def downgrade():
    op.drop_column('file_contents', 'blame_info')
