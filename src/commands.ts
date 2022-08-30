import { ExtensionContext, commands } from 'vscode';
import { Decorator } from './decorator';
import { CMDS } from './enums';

export function registerCommands(context: ExtensionContext, decorator: Decorator): void {
  let disposable: any[] = [];
  // Register the command for extension's default state (enabled/disabled).
  disposable.push(commands.registerCommand(CMDS.INLINE_FOLD_DEFAULT, () => {
    decorator.setDefault();
  }, null));

  // Register the command for extension's active state (activate/deactivate) per editor.
  disposable.push(commands.registerCommand(CMDS.INLINE_FOLD_TOGGLE, () => {
    decorator.toggle();
  }, null));
  context.subscriptions.push(...disposable);
}