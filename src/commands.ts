import { ExtensionContext, commands } from 'vscode';
import { Decorator } from './decorator';
import { CMDS } from './enums';

export function registerCommands(context: ExtensionContext, decorator: Decorator): void {
  let disposable: any[] = [];
  disposable.push(commands.registerCommand(CMDS.INLINE_FOLD_DEFAULT, () => {
    decorator.toggle();
  }, null));

  disposable.push(commands.registerCommand(CMDS.INLINE_FOLD_TOGGLE, () => {
    decorator.toggle();
  }, null));
  context.subscriptions.push(...disposable);
}