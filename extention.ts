import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let cmdCfg = vscode.commands.registerCommand('extension.config', async () => {
		// ユーザーに変更する設定項目を選ばせる
		const settingOption = await vscode.window.showQuickPick(
			['ユーザー名', 'サイト'],
			{
				placeHolder: '変更する設定を選択してください'
			}
		);

		if (settingOption) {
			let settingValue: string | undefined;

			// ユーザーが選択した設定項目に基づいて値を入力させる
			switch(settingOption){
				case 'ユーザー名':
					settingValue = await vscode.window.showInputBox({placeHolder: 'ユーザー名を入力してください'});
					if (settingValue) {
					const config = vscode.workspace.getConfiguration();
					await config.update('extension.userName', settingValue, vscode.ConfigurationTarget.Global);
					vscode.window.showInformationMessage(`ユーザー名を${settingValue}に設定しました`);
					}
				case 'サイト':
					settingValue = await vscode.window.showInputBox({placeHolder: '例: scp-jp.wikidot.com'}); 
					if (settingValue) {
						const config = vscode.workspace.getConfiguration();
						await config.update('extension.site', settingValue, vscode.ConfigurationTarget.Global);
						vscode.window.showInformationMessage(`サイトを${settingValue}に設定しました`);
						}
			}
		}
	});
	//辞書。構文の入力補完以外の、各種値などの予測変換。いらなかったら消す。
	const syntaxSubArray = ['class','id','x-small','xx-small','small','smaller','large','larger','x-large','xx-large','show','hide','style','type','hideLocation','top','both','bottom','link','alt','title','name','caption','width','align','right','left','center','clear','true','false','order','viewer','yes','no','desc',];
	const dict = vscode.languages.registerCompletionItemProvider('wikidot', {
		provideCompletionItems(_document: vscode.TextDocument, _position: vscode.Position, _token: vscode.CancellationToken, _context: vscode.CompletionContext) {
			var syntaxWord = syntaxSubArray.map(syntax => new vscode.CompletionItem(syntax, vscode.CompletionItemKind.Text));

						return syntaxWord;
					}
				}
		);
	//autoclose tags
	const modules = [
		//[[module name]], if close is true, insert[[/module]], args is arguments
		{
			name: "ListDrafts", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "ListPages", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "CountPages", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "ListUsers", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "TagCloud", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "PageCalendar", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "PageTree", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Backlinks", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "WantedPages", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "OrphanedPages", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Categories", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Watchers", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Members", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Join", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "SendInvitations", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "WhoInvited", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "CSS", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "NewPage", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Clone", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Redirect", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "ThemePreviewer", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "MailForm", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "PetitionAdmin", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "SiteGrid", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "FeaturedSite", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Feed", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "FrontForum", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Comments", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "RecentPosts", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "MiniRecentThreads", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "MiniActiveThreads", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "MiniRecentPosts", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Rate", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "RatedPages", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Gallery", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "FlickrGallery", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Files", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "Search", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "SearchAll", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "SearchUsers", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{
			name: "SiteChanges", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		}
	]
	const moduleCompletion = vscode.languages.registerCompletionItemProvider('wikidot', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			return modules.map(module => {
				var SnippetString: string;
				let snipArgs = '';
				//argsがあるとき、[[module name' args']]部分をsnipArgsとして出力
				if(module.args) {
					const snipArgsArray: string[] = [];
					module.argsContent?.forEach((synArg, index) =>{
						var options = `\${${index + 1}|${synArg.value.join(',')}|}`;
						if(synArg.name != ''){
							snipArgsArray.push(synArg.name + '=' + options);
						}else{
							snipArgsArray.push(options);
						}});

					snipArgs = ' ' + snipArgsArray.join(' ');
					}
				if(module.close) {
					SnippetString = `[[module ${module.name}${snipArgs}]]\n$0\n[[/module]]`;
				}else {
					SnippetString = `[[module ${module.name}${snipArgs}]]`;
				}
				const BracketCount = (document.lineAt(position.line).text.substring(0, position.character).match(/\[{2}/g) || []).length;
				if(BracketCount >= 1) {
					SnippetString = SnippetString.substring(2,SnippetString.length - 2)
				}
				const item = new vscode.CompletionItem(`[[module ${module.name}]]`, vscode.CompletionItemKind.Snippet);
				item.insertText = new vscode.SnippetString(SnippetString);
				item.documentation = new vscode.MarkdownString(module.description || "Documentation not found.\n\nPlease contact the developer.");
				return item
			}
		)
	}});
	const moduleHoverDocs = vscode.languages.registerHoverProvider('wikidot', {
		provideHover(document: vscode.TextDocument, position: vscode.Position) {
			const lineText = document.lineAt(position.line).text;
			const regexp = /\[\[\/?module\s(\w+).*?\]\]/g;
			const match = lineText.match(regexp)
			if(!match){
				return;
			}
			const tag = modules.find(t => t.name === match[1]);
			if (!tag || !tag.description) {
				return;
			}
			return new vscode.Hover(new vscode.MarkdownString(tag.description));
		}
	});
	const tags = [
		[
		{
			name: 'size', 
			description: `文字サイズを変更する。\n\n既定の単語(xx-small～xx-large)、もしくは1～５桁のpx,em,%値(10px,2em,300%など)。`, 
			inline: true, 
			args: true, 
			argsContent: [
				{
					name: '', 
					value: ['xx-small', 'x-small', 'smaller', 'small', 	'large', 'larger', 'x-large', 'xx-large']
				}]},
		{
			name: 'ul', 
			description: `順序なしリスト(箇条書き)。liやolなどと組み合わせて使う。\n\n使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類`, 
			inline: true,args: false
		},
		{
			name: 'li', 
			description: `ulやolのようなリストの項目。ulやolなどと組み合わせて使う。\n\n使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類`, 
			inline: true,args: false
		},
		{
			name: 'ol', 
			description: `順序つきリスト(箇条書き)。ulやliなどと組み合わせて使う。\n\n使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類`, 
			inline: true,args: false
		},
		{
			name: 'collapsible', 
			description: `テキストを折りたたむ。\n\nshow、hideはほぼ必須。\n\nhideLocation、foldedの設定は任意。`, 
			inline: false, 
			args: true, 
			argsContent: [{name: 'show', 
			value: ['"+ open"']}, 
			{name: 'hide', 
			value: ['"- hide"']}, 
			{name: 'hideLocation', 
			value: ['"top"','"both"','"bottom"']}, 
			{name: 'folded',
			value: ['"yes"', '"no"']}
			]
		},
		{
			name: 'a', 
			description: `[[a href="URL"]]Link text[[/a]]の形で使用。\n\n[[a_ href="URL"]]Link text[[/a]]のようにアンダースコアを挟むと改行と段落分けを防げる。\n\nhrefのほかに使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), style, target, typeの6種類`, 
			inline: true, 
			args: true, 
			argsContent: [{name: 'href', 
			value: ['"http://scp-jp.wikidot.com/example.link"']}]},
		{
			name: 'gallery', 
			description: `複数の画像を表示する。詳細は[ドキュメント](https://www.wikidot.com/doc-wiki-syntax:images#toc1)(あとで書き直すかも)`, 
			inline: false, 
			args: true, 
			argsContent: [
			{name: 'size', 
			value: ['"square"', '"thumbnail"', '"small"', '"medium"']}, 
			{name: 'order', 
			value: ['"name"', '"name desc"', '"created_at"', '"created_at desc"']},
			{name: 'viewer', 
			value: ['"false"', '"no"', '"true"', '"yes"']}
		]},
		{
			name: 'note', 
			description: `ノート(既定のスタイルを持つエレメント)を挿入する。div.wiki-note`, 
			inline: true,args: false},
		{
			name: 'html', 
			description: `htmlブロックを作成する。\n\nhtmlブロック内ではwikidot構文は解析されない代わりに、JSなどを動かせる。\n\n実際にはiframeで読み込まれる。CORS制約の関係でhtmlブロック外部に影響を及ぼすことはできない。`, 
			inline: false,args: false},
		{
			name: 'code', 
			description: `コードブロック。type="lang"の形で言語を指定すると、自動的にハイライトされる。\n\n対応言語は[ドキュメント](https://www.wikidot.com/doc-wiki-syntax:code-blocks)の通り。`, 
			inline: false, 
			args: true, 
			argsContent: [{name: 'type', 
			value: ['"php"', '"html"', '"cpp"', '"css"', '"diff"', '"dtd"', '"java"', '"javascript"', '"perl"', '"python"', '"ruby"', '"xml"']}]},
		{
			name: 'table', 
			description: `表を作成する。\n\n使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類`, 
			inline: false, 
			args: false},
		{
			name: 'row', 
			description: `表の行を定義する。\n\n使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類`, 
			inline: false, 
			args: false},
		{
			name: 'hcell', 
			description: `見出しセル。wikidot構文の\|\|~ header\|\|に対応。\n\n使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), style, colspan, rowspanの6種類`, 
			inline: false, 
			args: false},
		{
			name: 'cell', 
			description: `普通のセル。wikidot構文の\|\| cell \|\|に対応。\n\n使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), style, colspan, rowspanの6種類`, 
			inline: false, 
			args: false},
		{
			name: 'div', 
			description: `HTMLのdivと同じ`, 
			inline: false, 
			args: false},
		{
			name: 'span', 
			description: ``, 
			inline: true, 
			args: false},
		{
			name: 'math', 
			description: ``, 
			inline: true, 
			args: true, 
			argsContent: [{name: 'label', 
			value: ['"label1"']}]},
		{
			name: 'footnote', 
			description: ``, 
			inline: true, 
			args: false},
		{
			name: 'bibliography', 
			description: ``, 
			inline: false, 
			args: true, 
			argsContent: [{name: 'title', 
			value: ['"custom-title"']}]},
		{
			name: 'embedvideo', 
			description: ``, 
			inline: false, 
			args: false
		},
		{
			name: 'embedaudio', 
			description: ``, 
			inline: false, 
			args: false
		},
		{
			name: 'embed', 
			description: ``, 
			inline: false, 
			args: false
		},
		{
			name: 'iframe', 
			description: ``, 
			inline: false, 
			args: true, 
			argsContent: [
			{name: '', 
			value: ['URL-source']},
			{name: 'frameborder', 
			value: [0,1]
			},
			{name: 'align',
			value: ['"left"', '"right"', '"top"', '"bottom"', '"middle"']}, 
			{name: 'height', 
			value: ['"XX"', '"XX%"']}, 
			{name: 'width', 
			value: ['"XX"', '"XX%"']}, 
			{name: 'scrolling', 
			value: ['"yes"', '"no"']}, 
			{name: 'class,style', value: ['']}
		]},
		{
			name: 'iftags', 
			description: ``, 
			inline: false, 
			args: true, 
			argsContent: [{name: '', 
			value: ["Tag-name"]}]},
		{
			name: 'tabview', 
			description: ``, 
			inline: false, 
			args: false},
		{
			name: 'tab', 
			description: ``, 
			inline: false, 
			args: true, 
			argsContent: [{name: '', 
			value: ['tab-Name']}]},
		],
		[
			{
				name: 'toc',
				inline: false,
				args: false,
				description: `toc`},
			{
				name: 'image',
				inline: false,
				args: true,
				argsContent: [
				{name: '',
				inline: false,
				value: ['URL','file-name','/page-name/filename',':first','flickr:photoid','flickr:photoid_secret']},
				{name: 'link',
				inline: false,
				value: ['"any-link or anchor"']}, 
				{name: 'alt',
				inline: false,
				value: ['"any alt-text"']}, 
				{name: 'title',
				inline: false,
				value: ['"displayed when mouse hovered"']},
				{name: 'width',
				inline: false,
				value: ['"XXpx"']},
				{name: 'height',
				inline: false,
				value: ['"XXpx"']},
				{name: 'style',
				inline: false,
				value: ['"CSS: any-syle"']},
				{name: 'class',
				inline: false,
				value: ['"class"']},
				{name: 'size',
				inline: false,
				value: ['"square"','"thumbnail"','"small"','"medium"','"medium640"','"large"','"original"']},
			],
				description: `image`},
			{
				name: 'eref',
				inline: false,
				args: true,
				argsContent: [{name: '',
				inline: false,
				value: ['label']}],
				description: `eref`},
			{
				name: 'footnoteblock',
				inline: false,
				args: false},
			{
				name: 'date',
				inline: false,
				args: true,
				argsContent: [
				{name: '',
				inline: false,
				value: ['"timestamp"']},
				{name: 'format',
				inline: false,
				value: ['"format"']}
			]},
			{
				name: 'include',
				inline: false,
				args: true,
				argsContent: [{name: '',
				inline: false,
				value: [':site-name:page-name']}]},
			{
				name: 'file',
				inline: false,
				args: true,
				argsContent: [{name: '',
				inline: false,
				value: ['"file-name"']}]},
			{
				name: 'user',
				inline: false,
				args: true,
				argsContent: [{name: '',
				inline: false,
				value: ['user-name']}]},
			{
				name: 'social',
				inline: false,
				args: true,
				argsContent: [{name: '',
				inline: false,
				value: ['"SNS"']}]},
			{
				name: 'button',
				inline: false,
				args: true,
				argsContent: [{name: '',
				inline: false,
				value: ['words']}]},
			]
	];
	const SyntaxList = tags[0].concat(tags[1]); 
	const CompleteTags = vscode.languages.registerCompletionItemProvider('wikidot', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const autoClose = tags[0].map(tag => {
				const cursor = tag.inline ? '$0' : '\n$0\n';
				//argsがtrueのとき、argsContent.name=argsContent.valueとする
				let snipArgs = '';
				if(tag.args) {
					const snipArgsArray: string[] = [];
					tag.argsContent?.forEach((synArg, index) =>{
						var options = `\${${index + 1}|${synArg.value.join(',')}|}`;
						if(synArg.name != ''){
							snipArgsArray.push(synArg.name + '=' + options);
						}else{
							snipArgsArray.push(options);
						}});

					snipArgs = ' ' + snipArgsArray.join(' ');
					}
					const BracketCount = (document.lineAt(position.line).text.substring(0, position.character).match(/\[{2}/g) || []).length;
					var SnippetString = `[[${tag.name}${snipArgs}]]${cursor}[[/${tag.name}]]`;
					if(BracketCount >= 1){
						SnippetString = `${tag.name}${snipArgs}]]${cursor}[[/${tag.name}`;
				}
				const item = new vscode.CompletionItem(`[[${tag.name}]]`, vscode.CompletionItemKind.Snippet);
				item.insertText = new vscode.SnippetString(SnippetString);
				item.documentation = new vscode.MarkdownString(tag.description || "Documentation not found.\n\nPlease contact the developer.");

				return item;
			}
		);
			const nonClose = tags[1].map(tag => {
			let snipArgs = '';
			if(tag.args) {
				const snipArgsArray: string[] = [];
				tag.argsContent?.forEach((synArg, index) =>{
					var options = `\${${index + 1}|${synArg.value.join(',')}|}`;
					if(synArg.name != ''){
						snipArgsArray.push(synArg.name + '=' + options);
					}else{
						snipArgsArray.push(options);
					}});

				snipArgs = ' ' + snipArgsArray.join(' ');
				}
				const BracketCount = (document.lineAt(position.line).text.substring(0, position.character).match(/\[{2}/g) || []).length;
				var SnippetString = `[[${tag.name}${snipArgs}]]$0`;
				if(BracketCount >= 1){
					SnippetString = `${tag.name}${snipArgs}$0`;
			}
			const item = new vscode.CompletionItem(`[[${tag.name}]]`, vscode.CompletionItemKind.Snippet);
			item.insertText = new vscode.SnippetString(SnippetString);
			item.documentation = new vscode.MarkdownString(tag.description || "Documentation not found.\n\nPlease contact the developer.");

			return item;
		});
		return autoClose.concat(nonClose);
	}});
	const hoverDoc = vscode.languages.registerHoverProvider('wikidot', {
		provideHover(document: vscode.TextDocument, position: vscode.Position) {
			const lineText = document.lineAt(position.line).text;
			const regex = /\[\[\/?(\w+).*?\]\]/g;
			let match;
			let closestTag: string | null = null;
			let closestStart = -1;
			let closestEnd = -1;
			const cursor = position.character;
			while ((match = regex.exec(lineText)) !== null) {
				const matchStart = match.index;
				const matchEnd = matchStart + match[0].length;
				if (cursor >= matchStart && cursor <= matchEnd) {
					closestTag = match[1];
					closestStart = matchStart;
					closestEnd = matchEnd;
					break;
				}
			}
			if (!closestTag) {
				return;
			}
			const tag = SyntaxList.find(t => t.name === closestTag);
			if (!tag || !tag.description) {
				return;
			}
			const description = new vscode.MarkdownString(tag.description);
			description.isTrusted = true;
			return new vscode.Hover(description, new vscode.Range(position.line, closestStart, position.line, closestEnd));
		}
	});
	
	context.subscriptions.push(cmdCfg, dict, moduleCompletion, CompleteTags, hoverDoc, moduleHoverDocs);	
}
