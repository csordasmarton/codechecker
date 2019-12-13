# coding=utf-8
# -----------------------------------------------------------------------------
#                     The CodeChecker Infrastructure
#   This file is distributed under the University of Illinois Open Source
#   License. See LICENSE.TXT for details.
# -----------------------------------------------------------------------------

"""Setup for the test package 'analyze' and 'parse'."""
from __future__ import print_function
from __future__ import division
from __future__ import absolute_import

import os
import shutil

from libtest import env

TEST_WORKSPACE = None


def setup_package():
    """Setup the environment for the tests."""

    global TEST_WORKSPACE
    TEST_WORKSPACE = env.get_workspace('analyze_and_parse')

    os.environ['TEST_WORKSPACE'] = TEST_WORKSPACE
    os.environ['CC_LOG_COLOR'] = '0'


def teardown_package():
    """Delete the workspace associated with this test"""

    # TODO: If environment variable is set keep the workspace
    # and print out the path.
    global TEST_WORKSPACE

    print("Removing: " + TEST_WORKSPACE)
    shutil.rmtree(TEST_WORKSPACE)
