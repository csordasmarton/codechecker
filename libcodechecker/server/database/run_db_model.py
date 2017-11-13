# -------------------------------------------------------------------------
#                     The CodeChecker Infrastructure
#   This file is distributed under the University of Illinois Open Source
#   License. See LICENSE.TXT for details.
# -------------------------------------------------------------------------
"""
SQLAlchemy ORM model for the analysis run storage database.
"""

from __future__ import print_function
from __future__ import unicode_literals

from datetime import datetime
from math import ceil
import os

from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import *
from sqlalchemy.sql.expression import true

CC_META = MetaData(naming_convention={
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(column_0_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})

# Create base class for ORM classes.
Base = declarative_base(metadata=CC_META)


class DBVersion(Base):
    __tablename__ = 'db_version'
    # TODO: constraint, only one line in this table
    major = Column(Integer, primary_key=True)
    minor = Column(Integer, primary_key=True)

    def __init__(self, major, minor):
        self.major = major
        self.minor = minor


run_label = Table('run_labels', Base.metadata,
                  Column('run_id', Integer,
                         ForeignKey('runs.id', deferrable=True,
                                    initially="DEFERRED", ondelete='CASCADE'),
                         primary_key=True),
                  Column('label_id', Integer,
                         ForeignKey('labels.id', deferrable=True,
                                    initially="DEFERRED", ondelete='CASCADE'),
                         primary_key=True)
                  )


class Run(Base):
    __tablename__ = 'runs'

    __table_args__ = (
        UniqueConstraint('name'),
    )

    id = Column(Integer, autoincrement=True, primary_key=True)
    date = Column(DateTime)
    duration = Column(Integer)  # Seconds, -1 if unfinished.
    name = Column(String)
    version = Column(String)
    command = Column(String)
    can_delete = Column(Boolean, nullable=False, server_default=true(),
                        default=True)

    labels = relationship('Label', secondary=run_label, backref='runs')

    def __init__(self, name, version, command):
        self.date, self.name, self.version, self.command = \
            datetime.now(), name, version, command
        self.duration = -1

    def mark_finished(self):
        if self.duration == -1:
            self.duration = ceil((datetime.now() - self.date).total_seconds())


class Label(Base):
    __tablename__ = 'labels'

    id = Column(Integer, autoincrement=True, primary_key=True)
    name = Column(String, nullable=False)
    color = Column(String)

    def __init__(self, name, color):
        self.name = name
        self.color = color


class RunHistory(Base):
    __tablename__ = 'run_histories'

    id = Column(Integer, autoincrement=True, primary_key=True)
    run_id = Column(Integer,
                    ForeignKey('runs.id', deferrable=True,
                               initially="DEFERRED", ondelete='CASCADE'),
                    index=True)
    version_tag = Column(String)
    user = Column(String, nullable=False)
    time = Column(DateTime, nullable=False)

    run = relationship(Run, uselist=False)

    __table_args__ = (UniqueConstraint('run_id', 'version_tag'),)

    def __init__(self, run_id, version_tag, user, time):
        self.run_id = run_id
        self.version_tag = version_tag
        self.user = user
        self.time = time


class FileContent(Base):
    __tablename__ = 'file_contents'

    content_hash = Column(String, primary_key=True)
    content = Column(Binary)

    def __init__(self, content_hash, content):
        self.content_hash, self.content = content_hash, content


class File(Base):
    __tablename__ = 'files'

    id = Column(Integer, autoincrement=True, primary_key=True)
    filepath = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    content_hash = Column(String,
                          ForeignKey('file_contents.content_hash',
                                     deferrable=True,
                                     initially="DEFERRED", ondelete='CASCADE'))

    __table_args__ = (UniqueConstraint('filepath', 'content_hash'),)

    def __init__(self, filepath, content_hash):
        self.filepath = filepath
        self.filename = os.path.basename(filepath)
        self.content_hash = content_hash


class BugPathEvent(Base):
    __tablename__ = 'bug_path_events'

    line_begin = Column(Integer)
    col_begin = Column(Integer)
    line_end = Column(Integer)
    col_end = Column(Integer)

    order = Column(Integer, primary_key=True)

    msg = Column(String)
    file_id = Column(Integer, ForeignKey('files.id', deferrable=True,
                                         initially="DEFERRED",
                                         ondelete='CASCADE'), index=True)
    report_id = Column(Integer, ForeignKey('reports.id', deferrable=True,
                                           initially="DEFERRED",
                                           ondelete='CASCADE'),
                       primary_key=True)

    def __init__(self, line_begin, col_begin, line_end, col_end,
                 order, msg, file_id, report_id):
        self.line_begin, self.col_begin, self.line_end, self.col_end = \
            line_begin, col_begin, line_end, col_end

        self.order = order
        self.msg = msg
        self.file_id = file_id
        self.report_id = report_id


class BugReportPoint(Base):
    __tablename__ = 'bug_report_points'

    line_begin = Column(Integer)
    col_begin = Column(Integer)
    line_end = Column(Integer)
    col_end = Column(Integer)

    order = Column(Integer, primary_key=True)

    file_id = Column(Integer, ForeignKey('files.id', deferrable=True,
                                         initially="DEFERRED",
                                         ondelete='CASCADE'), index=True)
    report_id = Column(Integer, ForeignKey('reports.id', deferrable=True,
                                           initially="DEFERRED",
                                           ondelete='CASCADE'),
                       primary_key=True)

    def __init__(self, line_begin, col_begin, line_end, col_end,
                 order, file_id, report_id):
        self.line_begin, self.col_begin, self.line_end, self.col_end = \
            line_begin, col_begin, line_end, col_end

        self.order = order
        self.file_id = file_id
        self.report_id = report_id


class Report(Base):
    __tablename__ = 'reports'

    id = Column(Integer, autoincrement=True, primary_key=True)
    file_id = Column(Integer, ForeignKey('files.id', deferrable=True,
                                         initially="DEFERRED",
                                         ondelete='CASCADE'))
    run_id = Column(Integer,
                    ForeignKey('runs.id', deferrable=True,
                               initially="DEFERRED",
                               ondelete='CASCADE'),
                    index=True)
    bug_id = Column(String, index=True)
    checker_id = Column(String)
    checker_cat = Column(String)
    bug_type = Column(String)
    severity = Column(Integer)
    line = Column(Integer)
    column = Column(Integer)

    # TODO: multiple messages to multiple source locations?
    checker_message = Column(String)
    detection_status = Column(Enum('new',
                                   'unresolved',
                                   'resolved',
                                   'reopened',
                                   name='detection_status'))

    detected_at = Column(DateTime, nullable=False)
    fixed_at = Column(DateTime)

    # Cascade delete might remove rows SQLAlchemy warns about this
    # to remove warnings about already deleted items set this to False.
    __mapper_args__ = {
        'confirm_deleted_rows': False
    }

    # Priority/severity etc...
    def __init__(self, run_id, bug_id, file_id, checker_message, checker_id,
                 checker_cat, bug_type, line, column, severity,
                 detection_status, detection_date):
        self.run_id = run_id
        self.file_id = file_id
        self.bug_id = bug_id
        self.checker_message = checker_message
        self.severity = severity
        self.checker_id = checker_id
        self.checker_cat = checker_cat
        self.bug_type = bug_type
        self.detection_status = detection_status
        self.line = line
        self.column = column
        self.detected_at = detection_date


class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, autoincrement=True, primary_key=True)
    bug_hash = Column(String, nullable=False, index=True)
    author = Column(String, nullable=False)
    message = Column(Binary, nullable=False)
    created_at = Column(DateTime, nullable=False)

    def __init__(self, bug_hash, author, message, created_at):
        self.bug_hash = bug_hash
        self.author = author
        self.message = message
        self.created_at = created_at


class ReviewStatus(Base):
    __tablename__ = 'review_statuses'

    bug_hash = Column(String, primary_key=True)
    status = Column(Enum('unreviewed',
                         'confirmed',
                         'false_positive',
                         'intentional',
                         name='review_status'), nullable=False)
    author = Column(String, nullable=False)
    message = Column(Binary, nullable=False)
    date = Column(DateTime, nullable=False)


IDENTIFIER = {
    'identifier': "RunDatabase",
    'orm_meta': CC_META,
    'version_class': DBVersion
}
