import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const syntaxMainArray = ['size','toc','ul','li','ol','collapsible','a','image','gallery','note','html','code','table','row','hcell','cell','div','span','math','eref','footnote','footnoteblock','bibliography','date','include','embedvideo','embedaudio','embed','iframe','iftags','file','user','social','button','tabview','tab'];
    const syntaxSubArray = ['class','id','x-small','xx-small','small','smaller','large','larger','x-large','xx-large','show','hide','style','type','hideLocation','top','both','bottom','link','alt','title','name','caption','width','align','right','left','center','clear','true','false','order','viewer','yes','no','desc',];

    // wikidot構文で[[WORDS]]のように現れる単語を登録 
	const syntaxWord = vscode.languages.registerCompletionItemProvider('wikidot', {
		provideCompletionItems(_document: vscode.TextDocument, _position: vscode.Position, _token: vscode.CancellationToken, _context: vscode.CompletionContext) {
			var syntaxWordArray = syntaxMainArray.concat(syntaxSubArray);
			var syntaxWord = syntaxWordArray.map(syntax => new vscode.CompletionItem(syntax, vscode.CompletionItemKind.Text));

                        return syntaxWord;
                    }
                }
        );
	//autoclose tags
	const modules = [
		//[[module name]], if close is true, insert[[/module]], args is arguments
		{name: "ListDrafts", close: false},
		{name: "ListPages", close: true},
		{name: "CountPages", close: true},
		{name: "ListUsers", close: true},
		{name: "TagCloud", close: false},
		{name: "PageCalendar", close: false},
		{name: "PageTree", close: false},
		{name: "Backlinks", close: false},
		{name: "WantedPages", close: false},
		{name: "OrphanedPages", close: false},
		{name: "Categories", close: false},
		{name: "Watchers", close: true},
		{name: "Members", close: true},
		{name: "Join", close: true},
		{name: "SendInvitations", close: true},
		{name: "WhoInvited", close: true},
		{name: "CSS", close: true},
		{name: "NewPage", close: true},
		{name: "Clone", close: true},
		{name: "Redirect", close: true},
		{name: "ThemePreviewer", close: true},
		{name: "MailForm", close: true},
		{name: "PetitionAdmin", close: true},
		{name: "SiteGrid", close: true},
		{name: "FeaturedSite", close: true},
		{name: "Feed", close: true},
		{name: "FrontForum", close: true},
		{name: "Comments", close: true},
		{name: "RecentPosts", close: true},
		{name: "MiniRecentThreads", close: true},
		{name: "MiniActiveThreads", close: true},
		{name: "MiniRecentPosts", close: true},
		{name: "Rate", close: true},
		{name: "RatedPages", close: true},
		{name: "Gallery", close: true},
		{name: "FlickrGallery", close: false},
		{name: "Files", close: false},
		{name: "Search", close: false},
		{name: "SearchAll", close: false},
		{name: "SearchUsers", close: false},
		{name: "SiteChanges", close: false}
	]
	const moduleCompletion = vscode.languages.registerCompletionItemProvider('wikidot', {
		provideCompletionItems(_document: vscode.TextDocument, _position: vscode.Position, _token: vscode.CancellationToken, _context: vscode.CompletionContext) {
			return modules.map(module => {
				const item = new vscode.CompletionItem(`[[module ${module.name}]]`, vscode.CompletionItemKind.Snippet);
				if(module.close) {
					item.insertText = new vscode.SnippetString(`module ${module.name}]]\n$0\n[[/module`);
				}else {
					item.insertText = new vscode.SnippetString(`module ${module.name}`);
				}
				return item
			}
		)
	}});
	const autoCloseTarget = [
		{
			name: 'size', 
			description: '文字サイズを変更する。\n', 
			inline: true, 
			args: true, 
			argsContent: [
				{
					name: '', 
					value: ['xx-small', 'x-small', 'smaller', 'small', 	'large', 'larger', 'x-large', 'xx-large', 'custom']
				}]},
		{
			name: 'ul', 
			description: '', 
			inline: true,args: false
		},
		{
			name: 'li', 
			description: '', 
			inline: true,args: false
		},
		{
			name: 'ol', 
			description: '', 
			inline: true,args: false
		},
		{
			name: 'collapsible', 
			description: '', 
			inline: false, 
			args: true, 
			argsContent: [{name: 'show', 
			value: ['"+ open"']}, 
			{name: "hide", 
			value: ['"- hide"']}, 
			{name: "hideLocation", 
			value: ['"top"','"both"','"bottom"']}
			]
		},
		{
			name: 'a', 
			description: '', 
			inline: true, 
			args: true, 
			argsContent: [{name: 'href', 
			value: ['"http://scp-jp.wikidot.com/example.link"']}]},
		{
			name: 'gallery', 
			description: '', 
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
			description: '', 
			inline: true,args: false},
		{
			name: 'html', 
			description: '', 
			inline: false,args: false},
		{
			name: 'code', 
			description: '', 
			inline: false, 
			args: true, 
			argsContent: [{name: 'type', 
			value: ['"php"', '"html"', '"cpp"', '"css"', '"diff"', '"dtd"', '"java"', '"javascript"', '"perl"', '"python"', '"ruby"', '"xml"']}]},
		{
			name: 'table', 
			description: '', 
			inline: false, 
			args: false},
		{
			name: 'row', 
			description: '', 
			inline: false, 
			args: false},
		{
			name: 'hcell', 
			description: '', 
			inline: false, 
			args: false},
		{
			name: 'cell', 
			description: '', 
			inline: false, 
			args: false},
		{
			name: 'div', 
			description: '', 
			inline: false, 
			args: false},
		{
			name: 'span', 
			description: '', 
			inline: true, 
			args: false},
		{
			name: 'math', 
			description: '', 
			inline: true, 
			args: true, 
			argsContent: [{name: 'label', 
			value: ['"label1"']}]},
		{
			name: 'footnote', 
			description: '', 
			inline: true, 
			args: false},
		{
			name: 'bibliography', 
			description: '', 
			inline: false, 
			args: true, 
			argsContent: [{name: 'title', 
			value: ['"custom-title"']}]},
		{
			name: 'embedvideo', 
			description: '', 
			inline: false, 
			args: false
		},
		{
			name: 'embedaudio', 
			description: '', 
			inline: false, 
			args: false
		},
		{
			name: 'embed', 
			description: '', 
			inline: false, 
			args: false
		},
		{
			name: 'iframe', 
			description: '', 
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
			description: '', 
			inline: false, 
			args: true, 
			argsContent: [{name: '', 
			value: ["Tag-name"]}]},
		{
			name: 'tabview', 
			description: '', 
			inline: false, 
			args: false},
		{
			name: 'tab', 
			description: '', 
			inline: false, 
			args: true, 
			argsContent: [{name: '', 
			value: ['tab-Name']}]},
		];
	const autoCloseTags = vscode.languages.registerCompletionItemProvider('wikidot', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			return autoCloseTarget.map(tag => {
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
					let leftBrackets = '[[';
					let rightBrackets = ']]';
					if(BracketCount >= 1){
						leftBrackets = '';
						rightBrackets = '';
				}
				const item = new vscode.CompletionItem(`[[${tag.name}]]`, vscode.CompletionItemKind.Snippet);
				item.insertText = new vscode.SnippetString(`${leftBrackets}${tag.name}${snipArgs}]]${cursor}[[/${tag.name}${rightBrackets}`);
				item.documentation = new vscode.MarkdownString(tag.description || "Documentation not found.\nPlease contact the developer.");

				return item;
			}
		)        
	}});
	const hoverDoc = vscode.languages.registerHoverProvider('wikidot', {
		provideHover(document: vscode.TextDocument, position: vscode.Position) {
			const range = document.getWordRangeAtPosition(position, /\[\[\w+.*\]\]/);
			if (!range) {
				return;
			}
			const tag = autoCloseTarget.find(t => t.name === document.getText(range).replace(/\[\[| .*\]\]/g, ''));
			
			if (!tag || !tag.description) {
				return;
			}
	
			return new vscode.Hover(new vscode.MarkdownString(tag.description));
		}
	});

	context.subscriptions.push(syntaxWord, moduleCompletion, autoCloseTags, hoverDoc);	
}
