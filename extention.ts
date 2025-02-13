import * as vscode from 'vscode';
const configKey = 'ftmlACConfig';
async function updateSettings() {
    const config = vscode.workspace.getConfiguration(configKey);
    const choices = [
        { label: 'ユーザー名', key: 'userName', type: 'string' },
        { label: 'SCP記事', key: 'isSCP', type: 'boolean' },
		{label: 'テンプレート', key: 'template', type: 'string'}
    ];
    const selectedSetting = await vscode.window.showQuickPick(choices, {
        placeHolder: '変更する設定を選んでください'
    });

    if (!selectedSetting) {
        return;
    }

    let newValue: string | boolean | undefined;

    if (selectedSetting.type === 'boolean') {
        const boolChoice = await vscode.window.showQuickPick(['true', 'false'], {
            placeHolder: `現在の値: ${config.get(selectedSetting.key)}`
        });
        newValue = boolChoice === 'true';
    } else {
        newValue = await vscode.window.showInputBox({
            prompt: `${selectedSetting.label}を入力してください`,
            value: config.get<string>(selectedSetting.key) || ''
        });
    }

    if (newValue !== undefined) {
        await config.update(selectedSetting.key, newValue, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`${selectedSetting.label}を更新しました: ${newValue}`);
    }
}
export function activate(context: vscode.ExtensionContext) {
	//List of words and tags
	const syntaxSubArray = [
		'class','id','x-small','xx-small','small','smaller','large','larger','x-large','xx-large','show','hide','style','type','hideLocation','top','both','bottom','link','alt','title','name','caption','width','align','right','left','center','clear','true','false','order','viewer','yes','no','desc'
	];
	const modules = [
		//[[module name]], if close is true, insert[[/module]]
		{name: "ListDrafts", 
			close: false, 
			args: true, 
			argsContent: [{name: 'pagetype',value: ['"exists"','"notexists"']}], 
			description: `description`
		},
		{name: "ListPages", 
			close: true, 
			args: false, 
			description: `description`
		},
		{name: "CountPages", 
			close: true, 
			args: false,  
			description: `description`
		},
		{name: "ListUsers", 
			close: true, 
			args: true, 
			argsContent: [{name: 'users',value: ['"."']}], 
			description: `description`
		},
		{name: "TagCloud", 
			close: false, 
			args: false, 
			description: `description`
		},
		{name: "PageCalendar", 
			close: false, 
			args: false, 
			description: `description`
		},
		{name: "PageTree", 
			close: false, 
			args: false, 
			description: `description`
		},
		{name: "Backlinks", 
			close: false, 
			args: false, 
			description: `description`
		},
		{name: "WantedPages", 
			close: false, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "OrphanedPages", 
			close: false, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Categories", 
			close: false, 
			args: false, 
			description: `description`
		},
		{name: "Watchers", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Members", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Join", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "SendInvitations", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "WhoInvited", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "CSS", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "NewPage", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Clone", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Redirect", 
			close: true, 
			args: true, 
			argsContent: [{name: 'destination',value: ['"http://URL/where-to-go/"']}], 
			description: `description`
		},
		{name: "ThemePreviewer", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "MailForm", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "PetitionAdmin", 
			close: true, 
			args: false, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "SiteGrid", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "FeaturedSite", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Feed", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "FrontForum", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Comments", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "RecentPosts", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "MiniRecentThreads", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "MiniActiveThreads", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "MiniRecentPosts", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Rate", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "RatedPages", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Gallery", 
			close: true, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "FlickrGallery", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Files", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "Search", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "SearchAll", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "SearchUsers", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		},
		{name: "SiteChanges", 
			close: false, 
			args: true, 
			argsContent: [{name: '',value: ['']}], 
			description: `description`
		}
	]
	const tags = [
		[
		{name: 'size', 
			description: `文字サイズを変更する。  
既定の単語(xx-small～xx-large)、もしくは1～5桁のpx,em,%値(10px,2em,300%など)。  
\`\`\`  
[[size 200px]]  
200pxのデッカい文字  
[[/size]]  
\`\`\`
`, 
			inline: true, 
			args: true, 
			argsContent: [
				{name: '', 
					value: ['xx-small', 'x-small', 'smaller', 'small', 	'large', 'larger', 'x-large', 'xx-large']
				}]
		},
		{name: 'ul', 
			description: `順序なしリスト(箇条書き)。liやolなどと組み合わせて使う。\n\n使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類\n\n
\`\`\`
[[ul]]  
[[li]]content1[[/li]]  
[[li]]content2[[/li]]  
[[/ul]]  
\`\`\``, 
			inline: false,args: false
		},
		{name: 'li', 
			description: `ulやolのようなリストの項目。ulやolなどと組み合わせて使う。\n\n使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類\n\n
\`\`\`
[[ul]]  
[[li]]content1[[/li]]  
[[li]]content2[[/li]]  
[[/ul]]  
\`\`\`
`, 
			inline: true,args: false
		},
		{name: 'ol', 
			description: `順序つきリスト(箇条書き)。ulやliなどと組み合わせて使う。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類  
\`\`\`
[[ol]]  
[[li]]content1[[/li]]  
[[li]]content2[[/li]]  
[[/ol]]  
\`\`\``, 
			inline: true,args: false
		},
		{name: 'collapsible', 
			description: `テキストを折りたたむ。  
			show、hideはほぼ必須。  
			hideLocation、foldedの設定は任意。  
			入れ子にする場合はcolmodを使用のこと。  
\`\`\`  
[[collapsible show="+ クリックして展開" hide="- クリックして閉じる"]]  
折りたたまれた文章  
[[/collapsible]]  
folded="no"を記入すると、デフォルトで開いた状態になる。  
hideLocaionの初期値はtop  
\`\`\``, 
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
		{name: 'a', 
			description: `[[a href="URL"]]Link text[[/a]]の形で使用。  
			[[a_ href="URL"]]Link text[[/a]]のようにアンダースコアを挟むと改行と段落分けを防げる。  
			hrefのほかに使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), style, target, typeの6種類`, 
			inline: true, 
			args: true, 
			argsContent: [{name: 'href', 
			value: ['"http://scp-jp.wikidot.com/example.link"']}]
		},
		{name: 'gallery', 
			description: `複数の画像を表示する。  
			viewerをfalse/noにすると、画像をクリックした際にページ遷移して拡大する。`, 
			inline: false, 
			args: true, 
			argsContent: [
			{name: 'size', 
			value: ['"square"', '"thumbnail"', '"small"', '"medium"']}, 
			{name: 'order', 
			value: ['"name"', '"name desc"', '"created_at"', '"created_at desc"']},
			{name: 'viewer', 
			value: ['"false"', '"no"', '"true"', '"yes"']}
		]
		},
		{name: 'note', 
			description: `ノート(既定のスタイルを持つエレメント)を挿入する。  
			\`\`\`  
			[[div class="wiki-note"]]  
			これと同じ。  
			[[/div]]  
			\`\`\``, 
			inline: true,args: false
		},
		{name: 'html', 
			description: `htmlブロックを作成する。  
			htmlブロック内ではwikidot構文は解析されない代わりに、JSなどを動かせる。  
			実際にはiframeで読み込まれる。CORS制約の関係でhtmlブロック外部に影響を及ぼすことはできない。`, 
			inline: false,args: false
		},
		{name: 'code', 
			description: `コードブロック。type="lang"の形で言語を指定すると、自動的にハイライトされる。  
			対応言語は[ドキュメント](https://www.wikidot.com/doc-wiki-syntax:code-blocks)の通り。  
			本拡張機能の選択肢も同様。`, 
			inline: false, 
			args: true, 
			argsContent: [{name: 'type', 
			value: ['"php"', '"html"', '"cpp"', '"css"', '"diff"', '"dtd"', '"java"', '"javascript"', '"perl"', '"python"', '"ruby"', '"xml"']}]
		},
		{name: 'table', 
			description: `表を作成する。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類`, 
			inline: false, 
			args: false
		},
		{name: 'row', 
			description: `表の行を定義する。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類`, 
			inline: false, 
			args: false
		},
		{name: 'hcell', 
			description: `見出しセル。wikidot構文の\|\|~ header\|\|に対応。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), style, colspan, rowspanの6種類`, 
			inline: false, 
			args: false
		},
		{name: 'cell', 
			description: `普通のセル。wikidot構文の\|\| cell \|\|に対応。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), style, colspan, rowspanの6種類`, 
			inline: false, 
			args: false
		},
		{name: 'div', 
			description: `HTMLのdivと同じ。一行で書くと解析されない。  
使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類。  
\`\`\`  
[[div]]  
content  
[[/div]]  
\`\`\`
`, 
			inline: false, 
			args: false
		},
		{name: 'span', 
			description: `HTMLのspanと同じ。一行で書いてもよい。  
使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類。
\`\`\`  
[[span]]content[[/span]]  
\`\`\`
`, 
			inline: true, 
			args: false
		},
		{name: 'math', 
			description: `LaTeXを入力する。  
typeは必須ではなく、\\begin{...}...\\end{...}の書き方でも同様の表現ができる。
\`\`\`  
[[math type="align" label]]  
E = mc^2  
[[/math]]  
  
[[math label2]]  
\\begin{align}  
E = mc^2  
\\end{align}  
[[/math]]  
\`\`\`
文中に数式を記述する場合は以下のように書ける。  
\`\`\`  
[[$ E=mc^2 $]]  
\`\`\`
`, 
			inline: true, 
			args: true, 
			argsContent: [{name: 'label', 
			value: ['"label"']},
			{name: 'type', value: ['"align"', '"alignat"', '"aligned"', '"alignedat"', '"array"', '"Bmatrix"', '"bmatrix"', '"cases"', '"eqnarray"', '"equation"', '"gather"', '"gathered"', '"matrix"', '"multline"', '"pmatrix"', '"smallmatrix"', '"split"', '"subarray"', '"Vmatrix"', '"vmatrix"']}]
		},
		{name: 'footnote', 
			description: `脚注を記入する。  
途中での改行やwikidot構文の使用も可能。  
\`\`\`  
[[footnote]]  
脚注の中身  
[[/footnote]]  
\`\`\`
`, 
			inline: true, 
			args: false
		},
		{name: 'bibliography', 
			description: `参考文献リストを作成する。  
titleは必須ではない。指定すると、bibliographyブロックのタイトルが設定したものになる。  
\`\`\`  
すごい理論((bibcite label))  
[[bibliography title="任意のタイトル"]]  
: label : 参考文献のソース  
[[/bibliography]]  
\`\`\`
`, 
			inline: false, 
			args: true, 
			argsContent: [{name: 'title', 
			value: ['"custom-title"']}]
		},
		{name: 'embedvideo', 
			description: `対応しているサイトの映像を埋め込む。  
現在対応しているのは、Google VideoとYouTubeのみ。 
HTMLのembedを使用できる。  
\`\`\`  
[[embedvideo]]  
<embed arg="value"> </embed>  
[[/embedvideo]]  
\`\`\`
`, 
			inline: false, 
			args: false
		},
		{name: 'embedaudio', 
			description: `対応しているサイトの音声を埋め込む。  
現在対応しているのは、Odeo.comのみ。  
なお、このOdeo.comは2010年時点でサービス終了している。 
HTMLのembedを使用できる。  
\`\`\`  
[[embedaudio]]  
<embed arg="value"> </embed>  
[[/embedaudio]]  
\`\`\``, 
			inline: false, 
			args: false
		},
		{name: 'embed', 
			description: `他サイトのコンテンツを埋め込める。  
埋め込み可能なサービスのリストは[こちら](https://www.wikidot.com/doc:embedding)。  
\`\`\`  
[[embed]]  
<script type="text/javascript" src="url-source"></script>  
[[/embed]]  
\`\`\``, 
			inline: false, 
			args: false
		},
		{name: 'iframe', 
			description: `他サイトのコンテンツを埋め込める。  
必須なのはURL-sourceだけで、選択肢には無いがclass, styleも設定できる。  
\`\`\`  
[[iframe URL-source attr1="value1" attr2="value2"...]]  
\`\`\`
			`, 
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
			value: ['"yes"', '"no"']}
		]
		},
		{name: 'iftags', 
			description: `設置されたページに、指定したタグが含まれる、もしくは含まれない場合に内容を表示する。  
			+tagは付与されていなければならないタグ  
			-tagは付与されていてはいけないタグ  
			記号無しの場合は列挙したうちの1つが入っていればよい。  
\`\`\`  
[[iftags tag1 tag2 +tag3 -tag4]]  
content  
[[/iftags]]  
\`\`\`
			`, 
			inline: false, 
			args: true, 
			argsContent: [{name: '', 
			value: ["Tags"]}]
		},
		{name: 'tabview', 
			description: `クリックで切り替え可能なタブ構文を設置する。  
			[[tab]]構文と併用した場合のみ解析される。    
\`\`\`  
[[tabview]]  
[[tab first-tab]]  
Tab content  
[[/tab]]  
[[tab second-tab]]  
Second content  
[[/tab]]  
[[/tabview]]  
\`\`\``, 
			inline: false, 
			args: false
		},
		{name: 'tab', 
			description: `[[tabview]]構文の中に記述することで、タブを作成できる。  
			[[tabview]]構文と併用した場合のみ解析される。  
			タブの名前は任意の文字列に設定可能。  
			ただし、class="className"のような属性として解釈される書き方は出来ない。  
\`\`\`  
[[tabview]]  
[[tab first-tab]]  
Tab content  
[[/tab]]  
[[tab second-tab]]  
Second content  
[[/tab]]  
[[/tabview]]  
\`\`\`
`, 
			inline: false, 
			args: true, 
			argsContent: [{name: '', 
			value: ['tabName']}]
		}],
		[
		{name: 'toc',
			inline: false,
			args: false,
			description: `目次を作成する。  
			f>, f<でフローを指定できる。  
			\`\`\`  
			[[toc]]  
			([[f>toc]])  
			([[f<toc]])  
			\`\`\``
		},
		{name: 'image',
			inline: false,
			args: true,
			argsContent: [
			{name: '',
			value: ['URL','file-name','/page-name/filename',':first','flickr:photoid','flickr:photoid_secret']},
			{name: 'link',
			value: ['"any-link or anchor"']}, 
			{name: 'alt',
			value: ['"any alt-text"']}, 
			{name: 'title',
			value: ['"displayed when mouse hovered"']},
			{name: 'width',
			value: ['"XXpx"']},
			{name: 'height',
			value: ['"XXpx"']},
			{name: 'style',
			value: ['"CSS: any-syle"']},
			{name: 'class',
			value: ['"class"']},
			{name: 'size',
			value: ['"square"','"thumbnail"','"small"','"medium"','"medium640"','"large"','"original"']},
		],
			description: `画像ブロックを設置する。  
			必須なのは画像リンクのみ。  
			imageの前に記号をつけることで、フローや画像の位置を指定できる。  
			=: 中央揃え。  
			>: 右寄せ。  
			<: 左寄せ。  
			f>: 右に寄せ、文字を左に流し込む。  
			f<: 左に寄せ、文字を右に流し込む。  
			\`\`\`  
			[[image attached-file.png]]  
			[[=image centered-image.png]]  
			\`\`\``
		},
		{name: 'eref',
			inline: false,
			args: true,
			argsContent: [{name: '',
			value: ['label']}],
			description: `[[math label]]の形でラベル付けした数式を呼び出す。  
			基本的な見え方は脚注と同じ。  
			\`\`\`  
			[[math label1]]  
			E=mc^2  
			[[/math]]  
			[[eref label1]]  
			\`\`\``
		},
		{name: 'footnoteblock',
			inline: false,
			args: false, 
			description: `脚注のリストを任意の位置に設置する。  
			使用しなかった場合、脚注はページ最下部に表示される。  
			\`[[footnoteblock]]\``
		},
		{name: 'date',
			inline: false,
			args: true,
			argsContent: [
			{name: '',
			value: ['"timestamp"']},
			{name: 'format',
			value: ['"format"']}
		],
		description: `timestampはUNIX時間。  
		formatは必須ではない。  
		説明事項が多いため、下の例を参照のこと。  
		想定される出力は丸括弧で囲ってある。  
		\`\`\`  
		[[date 900240900]](1998/07/12 12:55:00)  
		[[date 900240900 format="%d. %m. %Y"]](12. 07. 1998)  
		[[date 900240900 format="%d. %m. %Y|agohover"]](12. 07. 1998　マウスホバー時に何日前か表示される)  
		[[date 900240900 format="現在から%O日前"]](現在から██days日前)  
		[[date 900240900 format="%d. %m. %Y"]](12. 07. 1998)  
		[[date 900240900 format="%e"]](12)  
		[[date 900240900 format="%B"]](July)  
		\`\`\``
		},
		{name: 'include',
			inline: false,
			args: true,
			argsContent: [{name: '',
			value: [':site-name:page-fullName']}],
			description: `他ページの中身を全て埋め込む。  
			同一wiki内のページは上の例、他wikiのページは下の例を参照のこと。  
			\`\`\`  
			[[include otherPage]]  
			  
			[[include :otherwiki:pageName]]  
			\`\`\``
			},
		{name: 'file',
			inline: false,
			args: true,
			argsContent: [{name: '',
			value: ['"file-name"']}],
			description: `そのページに添付されたファイルへのリンクを設置する。  
			バーティカルバー(|)の後に任意のテキストを設定することで、リンクのテキストを変更可能。  
			\`\`\`  
			[[file fileName | クリックしてファイルを開く]]  
			\`\`\``
			},
		{name: 'user',
			inline: false,
			args: true,
			argsContent: [{name: '',
			value: ['user-name']}],
			description: `ユーザー情報のリンクを設置する。  
			\`\`\`  
			[[user userName]](名前のリンクのみ)  
			[[\*user userName]](アイコンもつく)  
			\``
			},
		{name: 'social',
			inline: false,
			args: true,
			argsContent: [{name: '',
			value: ['blinklist','blogmarks','connotea','del.icio.us','digg','fark','feedmelinks','furl','linkagogo','newsvine','netvouz','reddit','simpy','spurl','wists','yahoomyweb','facebook']}],
			description: `SNSへのリンクを設置する。  
			設置可能なSNSは以下の通り。カンマで区切ることで複数記述できる。  
			\`\`\`  
			[[social]](設置可能なSNSを全て表示する)  
			[[social reddit,facebook]](一部のSNSのみ表示する)  
			\`\`\``
			},
		{name: 'button',
			inline: false,
			args: true,
			argsContent: [{name: '',
			value: ['edit','edit-append','edit-sections','history','print','files','tags','source','backlinks','talk','delete','rename','site-tools','edit-meta','watchers','parent','lock-page','set-tags']}],
			description: `ワンクリックで所定の動作を行うボタンを設置する。  
			それぞれの機能はページ下部のオプションと同様。  
			text(ボタンのテキスト)、class(CSSの指定等に使用)、style(CSSスタイル)がそれぞれ指定できる。  
			\`\`\`  
			[[button edit text="編集する"]]  
			[[button set-tags +add-this-tag -remove-this text="タグを変更"]]  
			\`\`\``
			},
		]
	];

	function getConfig() {
        const config = vscode.workspace.getConfiguration(configKey);
        return {
            userName: config.get('userName', 'user-name'),
			isSCP: config.get('isSCP', 'false'),
            template: config.get('template', '')
        };
    }
	let cmdcfg = vscode.commands.registerCommand('ftmlAC.config', updateSettings);
	let templateWriter = vscode.languages.registerCompletionItemProvider({scheme: 'file', language: 'wikidot'}, {
        provideCompletionItems(document, position) {
			const lineText = document.lineAt(position.line).text;
			if (!lineText.startsWith('!')) {
				return undefined;
			}
	
			const config = getConfig();
			const year = new Date().getFullYear();
			var title;
			var template;
			if(config.isSCP) {
				title = 'SCP-XXXX-JP - メタタイトル';
				template = `**アイテム番号:** SCP-XXXX-JP\n\n**オブジェクトクラス:** \n\n**特別収容プロトコル:** \n\n**説明:** `;
			} else {
				title = '作品のタイトル';
				template = config.template;
			}

			const snippet = new vscode.SnippetString(`[[include credit:start]]\n**タイトル:** ${title}\n**著者:** [[*user ${config.userName}]]\n**作成年:** ${year}\n[[include credit:end]]\n\n${template}`);
			const item = new vscode.CompletionItem('![[include credit:start]]', vscode.CompletionItemKind.Snippet);
			item.insertText = snippet;
			item.detail = 'クレジットモジュールとテンプレートを挿入';
			item.range = new vscode.Range(position.line, 0, position.line, 1);
			item.documentation = `クレジットモジュールと、設定したテンプレートを入力する。\n[[include credit:start]]\n**タイトル:** ${title}\n**著者:** [[*user ${config.userName}]]\n**作成年:** ${year}\n[[include credit:end]]\n\n${template}`;
			return [item];
		}
	}, '!');
	//辞書。構文の入力補完以外の、各種値などの予測変換。いらなかったら消す。
	const dict = vscode.languages.registerCompletionItemProvider('wikidot', {
		provideCompletionItems(_document: vscode.TextDocument, _position: vscode.Position, _token: vscode.CancellationToken, _context: vscode.CompletionContext) {
			var syntaxWord = syntaxSubArray.map(syntax => new vscode.CompletionItem(syntax, vscode.CompletionItemKind.Text));
						return syntaxWord;
					}
				}
		);
	//autoclose tags
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
				item.documentation.isTrusted = true;
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
				item.documentation.isTrusted = true;

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
			item.documentation.isTrusted = true;

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
	context.subscriptions.push(dict, cmdcfg, templateWriter, moduleCompletion, CompleteTags, hoverDoc, moduleHoverDocs);
}
