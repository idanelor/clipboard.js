import { StringItem } from "../ClipboardItem/convert";
import { TEXT_PLAIN } from "../ClipboardItem/data-types";
import { debugLog } from "../debug";
import { falsePromise, truePromise } from "../../promise/promise-compat";
import {
  copyTextUsingDOM,
  copyUsingTempElem,
  copyUsingTempSelection,
  execCopy,
} from "../strategies/dom";
import { seemToBeInIE, writeTextIE } from "../strategies/internet-explorer";

// Note: the fallback order is carefully tuned for compatibility. It might seem
// safe to move some of them around, but do not do so without testing all browsers.
export function writeFallback(stringItem: StringItem): Promise<boolean> {
  var hasTextPlain = TEXT_PLAIN in stringItem;

  // Internet Explorer
  if (seemToBeInIE()) {
    if (!hasTextPlain) {
      throw new Error("No `text/plain` value was specified.");
    }
    if (writeTextIE(stringItem[TEXT_PLAIN])) {
      return truePromise;
    } else {
      throw new Error("Copying failed, possibly because the user rejected it.");
    }
  }

  if (execCopy(stringItem)) {
    debugLog("regular execCopy worked");
    return truePromise;
  }

  // Success detection on Edge is not possible, due to bugs in all 4
  // detection mechanisms we could try to use. Assume success.
  if (navigator.userAgent.indexOf("Edge") > -1) {
    debugLog('UA "Edge" => assuming success');
    return truePromise;
  }

  // Fallback 1 for desktop Safari.
  if (copyUsingTempSelection(document.body, stringItem)) {
    debugLog("copyUsingTempSelection worked");
    return truePromise;
  }

  // Fallback 2 for desktop Safari.
  if (copyUsingTempElem(stringItem)) {
    debugLog("copyUsingTempElem worked");
    return truePromise;
  }

  // Fallback for iOS Safari.
  if (copyTextUsingDOM(stringItem[TEXT_PLAIN])) {
    debugLog("copyTextUsingDOM worked");
    return truePromise;
  }

  return falsePromise;
}
