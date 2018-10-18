import { Injectable } from '@angular/core';
import { BugPathEvent } from '@cc/db-access';

export interface HighlightStack {
  funcStack : any[],
  background : string
}

export interface BugPathHighlight {
  background : string,
  icon : string
}

type BugPathEventHighlights = { [key : number] : BugPathHighlight };

function extractFuncName(msg: string, prefix: string) {
  if (msg.startsWith(prefix)) {
    return msg.replace(prefix, "").replace(/'/g, "");
  }
}

@Injectable()
export class BugService {
  // Highlight colours go further down this array in a circular fashion
  // at each function call.
  static highlightColours = [
    '#ffffff',
    '#e9dddd',
    '#dde0eb',
    '#e5e8e5',
    '#cbc2b6',
    '#b8ccea',
    '#c1c9cd',
    '#a7a28f'
  ]

  highlighBugPathEvents(events: BugPathEvent[]) : BugPathEventHighlights {
    let highlightData = {};

    const stack : HighlightStack = {
      funcStack: [],
      background: null
    };

    events.forEach((step: BugPathEvent, index: number) => {
      const msg = step.msg;

      // The background must be saved BEFORE stack transition.
      // Calling is in the caller, return is in the called func, not "outside"
      let highlight: BugPathHighlight = {
        background : stack.background,
        icon: 'msg'
      };

      // Highlight the result node.
      if (index == events.length - 1) {
        highlight.icon = 'result';
        highlightData[index] = highlight;
        return;
      }

      // Highlight function calls and returns.
      let func;
      if (func = extractFuncName(msg, 'Calling ')) {
        highlight.icon = 'calling';

        stack.funcStack.push(func);
        stack.background = BugService.highlightColours[
          stack.funcStack.length % BugService.highlightColours.length];
      } else if (func = extractFuncName(msg, 'Returning from ')) {
        if (func === stack.funcStack[stack.funcStack.length - 1]) {
          highlight.icon = 'returning';

          stack.funcStack.pop();
          stack.background = BugService.highlightColours[
            stack.funcStack.length % BugService.highlightColours.length];
        } else {
          console.warn('Returned from ' + func + ' while the last function ' +
            'was ' + stack.funcStack[stack.funcStack.length - 1]);
        }
      }

      // Highlight other messages.
      const checkMessages = [
        { msg: 'Entered call from ', icon: 'entered-call' },
        { msg: 'Assuming the condition', icon: 'assume-switch' },
        { msg: 'Assuming', icon: 'assume-exclamation' },
        { msg: 'Entering loop body', icon: 'loop-enter' },
        { msg: 'Loop body executed', icon: 'loop-execute' },
        { msg: 'Looping back to the head of the loop', icon: 'loop-back' },
      ];

      for (let check of checkMessages) {
        if (msg.startsWith(check.msg)) {
          highlight.icon = check.icon;
          break;
        }
      }

      highlightData[index] = highlight;
    });

    return highlightData;
  }
}
