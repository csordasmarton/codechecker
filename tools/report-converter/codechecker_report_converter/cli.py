#!/usr/bin/env python3
# -------------------------------------------------------------------------
#                     The CodeChecker Infrastructure
#   This file is distributed under the University of Illinois Open Source
#   License. See LICENSE.TXT for details.
# -------------------------------------------------------------------------


import argparse
import logging
import os
import shutil

# If we run this script in an environment where 'codechecker_report_converter'
# module is not available we should add the grandparent directory of this file
# to the system path.
# TODO: This section will not be needed when CodeChecker will be delivered as
# a python package and will be installed in a virtual environment with all the
# dependencies.
if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.realpath(__file__))
    os.sys.path.append(os.path.dirname(current_dir))

from codechecker_report_converter.clang_tidy.analyzer_result import \
    ClangTidyAnalyzerResult  # noqa
from codechecker_report_converter.cppcheck.analyzer_result import \
    CppcheckAnalyzerResult  # noqa
from codechecker_report_converter.sanitizers.address.analyzer_result import \
    ASANAnalyzerResult  # noqa
from codechecker_report_converter.sanitizers.memory.analyzer_result import \
    MSANAnalyzerResult  # noqa
from codechecker_report_converter.sanitizers.thread.analyzer_result import \
    TSANAnalyzerResult  # noqa
from codechecker_report_converter.sanitizers.ub.analyzer_result import \
    UBSANAnalyzerResult  # noqa
from codechecker_report_converter.spotbugs.analyzer_result import \
    SpotBugsAnalyzerResult  # noqa


LOG = logging.getLogger('ReportConverter')

msg_formatter = logging.Formatter('[%(levelname)s] - %(message)s')
log_handler = logging.StreamHandler()
log_handler.setFormatter(msg_formatter)
LOG.setLevel(logging.INFO)
LOG.addHandler(log_handler)


supported_converters = {
    ClangTidyAnalyzerResult.TOOL_NAME: ClangTidyAnalyzerResult,
    CppcheckAnalyzerResult.TOOL_NAME: CppcheckAnalyzerResult,
    ASANAnalyzerResult.TOOL_NAME: ASANAnalyzerResult,
    MSANAnalyzerResult.TOOL_NAME: MSANAnalyzerResult,
    TSANAnalyzerResult.TOOL_NAME: TSANAnalyzerResult,
    UBSANAnalyzerResult.TOOL_NAME: UBSANAnalyzerResult,
    SpotBugsAnalyzerResult.TOOL_NAME: SpotBugsAnalyzerResult
}


def output_to_plist(analyzer_result, parser_type, output_dir, clean=False):
    """ Creates .plist files from the given output to the given output dir. """
    if clean and os.path.isdir(output_dir):
        LOG.info("Previous analysis results in '%s' have been removed, "
                 "overwriting with current result", output_dir)
        shutil.rmtree(output_dir)

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    parser = supported_converters[parser_type]()
    parser.transform(analyzer_result, output_dir)


def __add_arguments_to_parser(parser):
    """ Add arguments to the the given parser. """
    parser.add_argument('input',
                        type=str,
                        metavar='file',
                        default=argparse.SUPPRESS,
                        help="Code analyzer output result file which will be "
                             "parsed and used to generate a CodeChecker "
                             "report directory.")

    parser.add_argument('-o', '--output',
                        dest="output_dir",
                        required=True,
                        default=argparse.SUPPRESS,
                        help="This directory will be used to generate "
                             "CodeChecker report directory files.")

    parser.add_argument('-t', '--type',
                        dest='type',
                        metavar='TYPE',
                        required=True,
                        choices=supported_converters,
                        default=argparse.SUPPRESS,
                        help="Specify the format of the code analyzer output. "
                             "Currently supported output types are: " +
                              ', '.join(sorted(supported_converters)) + ".")

    parser.add_argument('-c', '--clean',
                        dest="clean",
                        required=False,
                        action='store_true',
                        help="Delete files stored in the output directory.")

    parser.add_argument('-v', '--verbose',
                        action='store_true',
                        dest='verbose',
                        help="Set verbosity level.")


def main():
    """ Report converter main command line. """
    parser = argparse.ArgumentParser(
        prog="report-converter",
        description="""
Creates a CodeChecker report directory from the given code analyzer output
which can be stored to a CodeChecker web server.""",
        epilog="""
Supported analyzers:
{0}""".format('\n'.join(["  {0} - {1}, {2}".format(
                         tool_name,
                         supported_converters[tool_name].NAME,
                         supported_converters[tool_name].URL)
                         for tool_name in sorted(supported_converters)])),
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    __add_arguments_to_parser(parser)

    args = parser.parse_args()

    if 'verbose' in args and args.verbose:
        LOG.setLevel(logging.DEBUG)

    return output_to_plist(args.input, args.type, args.output_dir,
                           args.clean)


if __name__ == "__main__":
    main()
