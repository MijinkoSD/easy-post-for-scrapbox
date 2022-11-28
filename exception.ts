/// <reference no-default-lib="true"/>
/// <reference lib="es2022"/>

import ExtensibleCustomError from "https://esm.sh/extensible-custom-error@0.0.7";

export class NoMatchSelectorError extends ExtensibleCustomError {
  constructor(selector?: string, error?: Error);
  constructor(error: Error);
  constructor(message?: string | Error, error?: Error) {
    if (typeof message != "string" && message !== undefined) {
      super(message);
      return;
    }
    super(`Selector "${message}" does not match.`, error);
  }
}
