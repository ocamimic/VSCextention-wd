import { log } from 'console';
import * as vscode from 'vscode';
const configKey = 'wikidotHelperConfig';
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
			argsContent: [{name: 'pageType',value: ['"exists"','"notexists"']}], 
			description: `そのサイトの、ドラフトが含まれるページのリストを表示する。  
			pageTypeをexistsにすると存在するページ、  
			notexistsにすると存在しないページ、  
			指定しない場合は全てのドラフトを表示する。  
\`\`\`
[[module ListDrafts pageType="exists"]]
\`\`\`
`
		},
		{name: "ListPages", 
			close: true, 
			args: true,
			argsContent: [
				{name: 'order',value: ['"name"','"fullname"','"title"','"created_by"','"created_at"','"updated_at"','"size"','"rating"','"votes"','"revisions"','"comments"','"random"']},
				{name: 'limit', value: ['"Any number"']},
				{name: 'perPage', value: ['"number(n < 250)"']},
				{name: 'reverse', value: ['"yes",""']},
				{name: 'separate', value: ['"yes"','"no"']},
				{name: 'wrapper', value: ['"yes"','"no"']},
				{name: 'prependLine', value: ['"Any text before the ListPages"']},
				{name: 'appendLine', value: ['"Any text after the ListPages"']}
			], 
			description: `指定したタグ、カテゴリ、ページ名などに属するページを表示する。  
			ほぼすべての値の設定は必須ではない。絞り込みは必要。  
			絞り込みオプションは多岐にわたるため、表を用意した。  
## ページの絞り込み  
| 項目 | 説明 |  
| - | - |  
| pagetype | 隠しページか普通のページか |  
| category | カテゴリでの絞り込み |  
| tags | タグでの絞り込み |  
| parent | 親ページでの絞り込み |  
| link_to | 特定のページへリンクしているページを選ぶ |  
| created_at | 作成日での絞り込み。YYYY、YYYY.MMに対応 |  
| updated_at | 編集日での絞り込み。YYYY、YYYY.MMに対応 |  
| created_by | ページ作成者での絞り込み |  
| rating | 現在のレートでの絞り込み(UV-DV) |  
| votes | 現在のvote数(UV+DV) |  
| offset | オフセット。nページ目を開く |  
| range | ソートした状態で、現在のページより後/前にあるかなど |  
| name | ページ名(カテゴリより後ろ) |  
| fullname | ページの完全な名前(カテゴリ込み) |   

			`
		},
		{name: "CountPages", 
			close: true, 
			args: false,  
			description: `指定した条件に合致するページを数える。  
# 絞り込み条件  
| 項目 | 説明 |  
| - | - |  
| pagetype | 隠しページか普通のページか |  
| category | カテゴリでの絞り込み |  
| tags | タグでの絞り込み |  
| parent | 親ページでの絞り込み |  
| link_to | 特定のページへリンクしているページを選ぶ |  
| created_at | 作成日での絞り込み。YYYY、YYYY.MMに対応 |  
| created_by | ページ作成者での絞り込み |  
| rating | 現在のレートでの絞り込み(UV-DV) |  
| offset | オフセット。nページ目を開く |  
| range | ソートした状態で、現在のページより後/前にあるかなど |   
`
		},
		{name: "ListUsers", 
			close: true, 
			args: true, 
			argsContent: [{name: 'users',value: ['"."']}], 
			description: `現在ページを閲覧しているアカウントのユーザー名やIDを表示する。`
		},
		{name: "TagCloud", 
			close: false, 
			args: true,
			argsContent: [{name: 'maxFontSize', value: ['"any length in unit of px, pt, em, and %"']},{name: 'minFontSize', value: ['"any length in unit of px, pt, em, and %"']},{name: 'maxColor', value: ['"RRR,GGG,BBB(0~255)"']},{name: 'minColor', value: ['"RRR,GGG,BBB(0~255)"']},{name: 'limit', value: ['any number']},{name: 'target', value: ['"name of pege, opened when tags are clicked."']},{name: 'category', value: ['"any category"']},{name: 'showHidden', value: ['"if true or yes, hidden tags will be displayed "']},{name: 'urlAttrPrefix', value: ['"any string"']},{name: 'skipCategoryFromUrl', value: ['"if true or yes, \"category\" will be removed from URLs of tags."']}],
			description: `指定したカテゴリなどに付与されているタグの一覧を表示する。  
全てのオプションは必須ではない。  
以下のような書き方をすれば任意の大きさで3D表示できるが、flashを使用しているため非推奨。  
\`\`\`
[[module TagCloud mode="3d" width="500px" height="500px"]]  
\`\`\`  
`
		},
		{name: "PageCalendar", 
			close: false, 
			args: true, 
			argsContent: [{name: 'category', value: ['"any string"','"@URL"']},
			{name: 'tags', value: ['"any string"','"@URL"']},
			{name: 'startPage', value: ['"any string"']},
			{name: 'urlAttrPrefix', value: ['"any string"']}],
			description: `設定したカテゴリ・タグの年ごとのページ数を表示する。  
例えば、次のような例の場合、hogeカテゴリに属し、hugaタグを持ち、piyoタグを持たないページを数える。  
2024(1)などと表示されるリンクをクリックすると、hogera/hogehoge_date/2024に飛ぶ。  
\`\`\`
[[module PageCalendar category="hoge" tags="+huga -piyo" startPage="hogera" urlAtrPrefix="hogehoge"]]
\`\`\``
		},
		{name: "PageTree", 
			close: false, 
			args: true, 
			argsContent: [{name: 'root',value: ['"any string"']}, {name: 'showRoot', value: ['"true"', '"false"']}, {name: 'depth', value: ['"n"']}],
			description: `ページの親子関係を表示する。
rootで基準とするページ、showRootでrootを表示するか否かを指定する。
depthが1のときはrootの子のみ、2のときは孫まで表示する。
\`\`\`
[[module PageTree root="parent" showRoot="true/false"]]
\`\`\``
		},
		{name: "Backlinks", 
			close: false, 
			args: false, 
			description: `バックリンクを表示する。ページ最下部のオプションから表示するものと同様。
\`\`\`
[[module Backlinks]]
\`\`\``
		},
		{name: "WantedPages", 
			close: false, 
			args: false, 
			description: `存在しないにも拘わらずリンクされているページを表示する。
\`\`\`
[[module WantedPages]]
\`\`\``
		},
		{name: "OrphanedPages", 
			close: false, 
			args: false, 
			description: `バックリンクの無いページを表示する。
\`\`\`
[[module OrphanedPages]]
\`\`\``
		},
		{name: "Categories", 
			close: false, 
			args: true,
			argsContent: [{name: 'includeHidden', value: ['"true"', '"false"']}],
			description: `カテゴリ名と、そのカテゴリのページを一覧表示する。
includeHiddenがtrueのとき、隠しカテゴリも表示する。初期値はfalse。
\`\`\`
[[modue Categories includeHidden="true"]]
\`\`\``
		},
		{name: "Watchers", 
			close: false, 
			args: true, 
			argsContent: [{name: 'noActions',value: ['"true"', '"false"']}], 
			description: `ページが編集されたときに通知を受け取るユーザーを表示する。
\`\`\`
[[module Watchers noAction="true"]]
\`\`\``
		},
		{name: "Members", 
			close: false, 
			args: true, 
			argsContent: [{name: 'group',value: ['"members"','"admins"','"moderators"']},{name: 'showSince',value: ['"no"','"yes"']},{name: 'order',value: ['"userId"','"userIdDesc"','"joined"','"joinedDesc"','"name"','"nameDesc"']}], 
			description: `サイトのメンバーを表示する。
groupは一般メンバー、管理者、モデレーターでの絞り込み、showSinceはサイト参加日を表示する。
showSince="yes"はgroup="members"のときのみ有効。
\`\`\`
[[module Members group="admins" order="name"]]
\`\`\``
		},
		{name: "Join", 
			close: false, 
			args: true, 
			argsContent: [{name: 'button',value: ['"Button text"']}, {name: 'class',value: ['"CSS-class"']}], 
			description: `サイト参加ボタンを作成する。
buttonで指定したテキストがボタンに表示される。
\`\`\`
[[module Join button="サイトに参加！" class="cuteJoinButton"]]
\`\`\``
		},
		{name: "SendInvitations", 
			close: false, 
			args: false, 
			description: `サイトへの招待を送信する。
現在は使えない。`
		},
		{name: "WhoInvited", 
			close: false, 
			args: false, 
			description: `ユーザーの名前を入力すると、どうやってそのメンバーがサイトに参加したかがわかる。
\`\`\`
[[module WhoInvited]]
\`\`\``
		},
		{name: "CSS", 
			close: true, 
			args: true, 
			argsContent: [{name: 'show',value: ['"true"', '"false"']}, {name: 'disable', value: ['"true"', '"false"']}], 
			description: `ページのCSSを自由に記述できる。
変数のshow、disableはどちらもデフォルトでfalse。
show="true"の場合、[[code type="css"]][[/code]]でコードを囲ったものと同様に表示される。
disable="true"の場合、モジュール内のCSSが適用されない。
\`\`\`
[[module CSS show="true"]]
.red {
    color: red;
}
[[/module]]
\`\`\``
		},
		{name: "NewPage", 
			close: true, 
			args: false, 
			argsContent: [{name:'category',value: ['"any category name"']},
			{name:'template',value: ['']},
			{name:'size',value: ['']},
			{name:'button',value: ['']},
			{name:'format',value: ['']},
			{name:'tags',value: ['']},
			{name:'parent',value: ['']},
			{name:'mode',value: ['']},
			{name:'goTo',value: ['']}], 
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
			close: false, 
			args: false, 
			description: `ページを評価する。
1~5個の星で評価する設定の場合は閉じタグ必須となる。`
		},
		{name: "RatedPages", 
			close: false, 
			args: true, 
			argsContent: [{name: 'category',  value: ['"any category"']},{name: 'order',  value: ['"date-created-asc"','"date-created-desc"','"rating-asc"','"rating-desc"']},{name: 'minRating',  value: ['"integer"']},{name: 'maxRating',  value: ['"integer"']},{name: 'limit',  value: ['"integer"']},{name: 'comments',  value: ['"yes"']}], 
			description: `評価の高いページを表示する。
オプションは全て任意。
\`\`\`
[[module RatedPages]]
\`\`\``
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
			args: false, 
			description: `ページの編集やタグの追加など、広義の"ページ編集"を表示する。
フォーラムへの投稿は含まれない。
\`\`\`
[[module SiteChanges]]
\`\`\``
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
			description: `順序なしリスト(箇条書き)。liやolなどと組み合わせて使う。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類  
\`\`\`  
[[ul]]  
[[li]]content1[[/li]]  
[[li]]content2[[/li]]  
[[/ul]]  
\`\`\`
`, 
			inline: false,args: false
		},
		{name: 'li', 
			description: `ulやolのようなリストの項目。ulやolなどと組み合わせて使う。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類  
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
\`\`\`
`, 
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
\`\`\`
`, 
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
			description: `リンクを設置する。  
			[[a_ href="URL"]]Link text[[/a]]のようにアンダースコアを挟むと改行と段落分けを防げる。  
			hrefのほかに使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), style, target, typeの6種類  
\`\`\`  
[[a href="https://example.com/hogehoge"]]hogehogeへ行く[[/a]]  
[[a_ href="https://example.com/piyopiyo"]]piypiyoはコチラ[[/a]]  
\`\`\`  
			`, 
			inline: true, 
			args: true, 
			argsContent: [{name: 'href', 
			value: ['"http://scp-jp.wikidot.com/example.link"']}]
		},
		{name: 'gallery', 
			description: `複数の画像を表示する。  
			viewerをfalse/noにすると、画像をクリックした際にページ遷移して拡大する。  
			閉じタグを使用しない場合はページのファイルを表示する。  
\`\`\`  
[[gallery args]]  
[[gallery args]]  
: image-source1 size="..." order="..." ...  
: image-source2 size="..." order="..." ...  
[[/gallery]]  
\`\`\`
`, 
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
			\`[[note]]Note content[[/note]]\`  
\`\`\`  
[[div class="wiki-note"]]  
これと同じ。  
[[/div]]  
\`\`\`
`, 
			inline: true,
			args: false
		},
		{name: 'html', 
			description: `htmlブロックを作成する。  
			htmlブロック内ではwikidot構文は解析されない代わりに、JSなどを動かせる。  
			実際にはiframeで読み込まれる。CORS制約の関係でhtmlブロック外部に影響を及ぼすことはできない。  
\`\`\`  
[[html]]  
<div>...</div>  
<script>  
...  
</script>  
[[/html]]  
\`\`\`
`, 
			inline: false,args: false
		},
		{name: 'code', 
			description: `コードブロック。type="lang"の形で言語を指定すると、自動的にハイライトされる。  
			対応言語は[ドキュメント](https://www.wikidot.com/doc-wiki-syntax:code-blocks)の通り。  
			本拡張機能の選択肢も同様。  
\`\`\`  
[[code type="CSS"]]  
.example {  
style: value;  
}  
[[/code]]  
\`\`\`
`, 
			inline: false, 
			args: true, 
			argsContent: [{name: 'type', 
			value: ['"php"', '"html"', '"cpp"', '"css"', '"diff"', '"dtd"', '"java"', '"javascript"', '"perl"', '"python"', '"ruby"', '"xml"']}]
		},
		{name: 'table', 
			description: `表を作成する。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類。  
\`\`\`  
[[table]]  
[[row]]  
[[hcell]]  
Header1  
[[/hcell]]  
[[hcell]]  
Header2  
[[/hcell]]  
[[/row]]  
[[row]]  
[[cell]]  
Cell1  
[[/cell]]  
[[cell]]  
Cell2  
[[/cell]]  
[[/row]]  
[[table]]  
\`\`\`  
`, 
			inline: false, 
			args: false
		},
		{name: 'row', 
			description: `表の行を定義する。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), styleの4種類。  
\`\`\`  
[[table]]  
[[row]]  
[[hcell]]  
Header1  
[[/hcell]]  
[[hcell]]  
Header2  
[[/hcell]]  
[[/row]]  
[[row]]  
[[cell]]  
Cell1  
[[/cell]]  
[[cell]]  
Cell2  
[[/cell]]  
[[/row]]  
[[table]]  
\`\`\`
`, 
			inline: false, 
			args: false
		},
		{name: 'hcell', 
			description: `見出しセル。wikidot構文の\|\|~ header\|\|に対応。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), style, colspan, rowspanの6種類。  
\`\`\`  
[[table]]  
[[row]]  
[[hcell]]  
Header1  
[[/hcell]]  
[[hcell]]  
Header2  
[[/hcell]]  
[[/row]]  
[[row]]  
[[cell]]  
Cell1  
[[/cell]]  
[[cell]]  
Cell2  
[[/cell]]  
[[/row]]  
[[table]]  
\`\`\`
`, 
			inline: false, 
			args: false
		},
		{name: 'cell', 
			description: `普通のセル。wikidot構文の\|\| cell \|\|に対応。  
			使用可能な属性は、class, id, [data-*](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*), style, colspan, rowspanの6種類。  
\`\`\`  
[[table]]  
[[row]]  
[[hcell]]  
Header1  
[[/hcell]]  
[[hcell]]  
Header2  
[[/hcell]]  
[[/row]]  
[[row]]  
[[cell]]  
Cell1  
[[/cell]]  
[[cell]]  
Cell2  
[[/cell]]  
[[/row]]  
[[table]]  
\`\`\`
`, 
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
\`\`\`
`, 
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
\`\`\`
`, 
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
\`\`\`
`, 
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
\`\`\`
`
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
\`\`\`
`
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
\`\`\`
`
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
\`\`\`  
`
		},
		{name: 'include',
			inline: false,
			args: true,
			argsContent: [{name: '',
			value: [':site-name:page-fullName']}],
			description: `他ページの中身を全て埋め込む。  
同一wiki内のページは上の例、他wikiのページは下の例を参照のこと。  
\`\`\`  
[[include pagename]]  
  
[[include :wikiname:pagename]]  
\`\`\`  
			`
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
\`\`\`
`
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
\`\`\`
`
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
\`\`\`
`
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
\`\`\`
`
			}
		],
		[
			{name: '#expr',
				inline:true,
				args:true,
				argsContent:[{name: '',value: ['expression']}],
				description: `入力した数式を解析し、その値を出力する。  
				abs()、min()、max()の3種類が使用できる。
\`\`\`  
[[#expr 3 + 2]] => 5  
[[#expr abs(-1)]] => 1  
[[#expr min(4, 3, 7, 8)]] => 3  
[[#expr max(4, 3, 7, 8)]] => 8  
\`\`\`
`
			},
			{name: '#if',
				inline:true,
				args:true,
				argsContent:[{name: '',value: ['true','false']},{name: '',value: ['if true']},{name: '',value: ['if false']}],
				description: `第1引数にtrue/false、  
				第2引数にtrueの場合の出力、  
				第3引数にfalseの場合の出力。  
				falseとして扱われるのはfalse(文字列)、null(文字列)、空白、0の4つのみ。  
				それ以外はtrueとして扱われる。
\`\`\`
[[#if true | 犬 | 猫]] => 犬
[[#if false | 犬 | 猫]] => 猫
\`\`\`
`
			},
			{name: '#ifexpr',
				inline:true,
				args:true,
				argsContent:[{name: '',value: ['true','false']},{name: '',value: ['if true']},{name: '',value: ['if false']}],
				description: `第1引数に数式、  
				第2引数にtrueの場合の出力、  
				第3引数にfalseの場合の出力。  
\`\`\`
[[#ifexpr 1<2 | 1は2より小さい | 1は2より大きい]] => 1は2より小さい
\`\`\`
`
			}
		]
	];
var countShinchoku = 0;
modules.forEach(args => {
	if(args.description != "description") {
		countShinchoku++
	}
})
console.log(`${modules.length}個中${countShinchoku}個終わってる`)
	function getConfig() {
        const config = vscode.workspace.getConfiguration(configKey);
        return {
            userName: config.get('userName', 'user-name'),
			isSCP: config.get('isSCP', 'false'),
            template: config.get('template', '')
        };
    }
	let cmdcfg = vscode.commands.registerCommand('wikidotHelper.config', updateSettings);
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
				template = new Object(config.template);
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
			const regexp = /\[\[module\s(\w+)(.*)?\]\]/;
			const match = lineText.match(regexp);
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
	const SyntaxList = tags[0].concat(tags[1],tags[2]);
	const completeTagsClose = vscode.languages.registerCompletionItemProvider('wikidot', {
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
					const BracketCount = (document.lineAt(position.line).text.substring(0, position.character).match(/(\[{2})/g) || []).length;
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
		return autoClose;
	}});
	const completeTagsNonClose = vscode.languages.registerCompletionItemProvider('wikidot', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
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
		return nonClose;
	}});
	const completeTagsExpr = vscode.languages.registerCompletionItemProvider('wikidot', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const expr = tags[2].map(tag => {
				let snipArgs = '';
					const snipArgsArray: string[] = [];
					tag.argsContent?.forEach((synArg, index) =>{
						var options = `\${${index + 1}|${synArg.value.join(',')}|}`;
							snipArgsArray.push(options);
						});
					snipArgs = ' ' + snipArgsArray.join(' | ');
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
		return expr;
	}});

	const hoverDoc = vscode.languages.registerHoverProvider('wikidot', {
		provideHover(document: vscode.TextDocument, position: vscode.Position) {
			const lineText = document.lineAt(position.line).text;
			const regex = /\[\[\/?([\w\#]+).*?\]\]/g;
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
	context.subscriptions.push(dict, cmdcfg, templateWriter, moduleCompletion, completeTagsClose, completeTagsNonClose, completeTagsExpr, hoverDoc, moduleHoverDocs);
}
