const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let terminal; // Terminal persistente

function activate(context) {
    const runCommand = vscode.commands.registerCommand('c-cpp-compiler-run.runC', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Nenhum ficheiro aberto.');
            return;
        }

        const document = editor.document;
        const language = document.languageId;

        if (language !== 'c' && language !== 'cpp') {
            vscode.window.showErrorMessage('Este ficheiro não é C nem C++.');
            return;
        }

        const filePath = document.fileName;
        const fileDir = path.dirname(filePath);
        const makefilePath = path.join(fileDir, 'Makefile');

        if (!fs.existsSync(makefilePath)) {
            vscode.window.showErrorMessage('Nenhum Makefile encontrado no diretório do ficheiro.');
            return;
        }

        if (!terminal) {
            terminal = vscode.window.createTerminal("C/C++ Runner");
        }

        terminal.show(true);
        terminal.sendText(`cd "${fileDir}" && make`);
    });

    context.subscriptions.push(runCommand);
}

function deactivate() {
    if (terminal) {
        terminal.dispose();
    }
}

exports.activate = activate;
exports.deactivate = deactivate;