const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let terminal;

function activate(context) {
    try {
        console.log('Extension activate start');

        const compileCommand = vscode.commands.registerCommand('c-cpp-compiler-run.compileC', () => {
            try {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showErrorMessage('Nenhum ficheiro aberto.');
                    return;
                }

                const document = editor.document;
                const language = document.languageId;

                if (language !== 'c' && language !== 'cpp' && language !== 'mak') {
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

                const compileCmd = vscode.workspace.getConfiguration('c-cpp-compiler-run').get('compileCommand') || 'make';

                if (!terminal) {
                    terminal = vscode.window.createTerminal("C/C++ Runner");
                }

                terminal.show(true);
                terminal.sendText(`cd "${fileDir}" && ${compileCmd}`);
            } catch (err) {
                console.error('Erro no comando compileC:', err);
                vscode.window.showErrorMessage('Erro ao compilar: ' + err.message);
            }
        });

        const deletingBuild = vscode.commands.registerCommand('c-cpp-compiler-run.deletBuild', () => {
            try {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showErrorMessage('Nenhum ficheiro aberto.');
                    return;
                }

                const document = editor.document;
                const language = document.languageId;

                if (language !== 'c' && language !== 'cpp' && language !== 'mak') {
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

                const compileCmd = vscode.workspace.getConfiguration('c-cpp-compiler-run').get('deletBuild') || 'make clear';

                if (!terminal) {
                    terminal = vscode.window.createTerminal("C/C++ Runner");
                }

                terminal.show(true);
                terminal.sendText(`${compileCmd}`);
            } catch (err) {
                console.error('Error in the Delete Build command:', err);
                vscode.window.showErrorMessage('Error Deleting Build: ' + err.message);
            }
        });

        context.subscriptions.push(compileCommand);
        context.subscriptions.push(deletingBuild);

        console.log('Extension activate end');
    } catch (err) {
        console.error('Erro na ativação da extensão:', err);
        vscode.window.showErrorMessage('Erro na ativação da extensão: ' + err.message);
    }
}

function deactivate() {
    if (terminal) {
        terminal.dispose();
        terminal = undefined;
    }
}

exports.activate = activate;
exports.deactivate = deactivate;
