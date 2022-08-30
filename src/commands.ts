import { ExtensionContext, commands, window } from 'vscode';
import { Decorator } from './decorator';
import { Cmds } from './enums';

export function registerCommands(context: ExtensionContext, decorator: Decorator): void {
  let disposable: any[] = [];
  disposable.push(commands.registerCommand(Cmds.InlineFoldEnabled, () => {
    decorator.toggle();
  }, null));

  disposable.push(commands.registerCommand(Cmds.InlineFoldToggle, () => {
    decorator.toggle();
  }, null));
  context.subscriptions.push(...disposable);
}