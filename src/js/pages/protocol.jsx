import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Protocal extends PureComponent {

	static displayName = 'Protocal';

	constructor(props){
		super(props)
	};

	render(){

		return (
			<div className="protocol">
				<div className="protocol-head">
					<h1>ViaOTC用户协议</h1>
				</div>
				<div className="protocol-body">
					<p>ViaOTC网络服务条款是由ViaOTC团队与ViaOTC用户就ViaOTC网的各项服务所制定的相关权利义务规范。ViaOTC的运营者依据本协议为用户提供服务。用户访问或使用本站点，即表示已接受并同意本协议的所有条件和条款，同意将其作为确定双方权利义务的依据；不愿接受本协议的，不得访问或使用本站点。本协议不涉及ViaOTC用户与其他用户之间因比特币交易而产生的法律关系及法律纠纷。注意：ViaOTC有权对本协议进行修改，请用户定期查看本协议。</p>
					<h2>我们在此特别提醒您：</h2>
					<p>1 数字资产本身不由任何金融机构或公司或本网站发行；</p>
					<p>2 数字资产市场是全新的、未经确认的，而且可能不会增长；</p>
					<p>3 数字资产主要由投机者大量使用，零售和商业市场使用相对较少，数字资产交易存在极高风险，其全天不间断交易，没有涨跌限制，价格容易受庄家、全球政府政策的影响而大幅波动；</p>
					<p>4 因各国法律、法规和规范性文件的制定或者修改，数字资产交易随时可能被暂停或被禁止。</p>
					<p>数字资产交易有极高风险，并不适合绝大部分人士。您了解和理解此投资有可能导致部分损失或全部损失，所以您应该以能承受的损失程度来决定投资的金额。您了解和理解数字资产会产生衍生风险，所以如有任何疑问，建议先寻求理财顾问的协助。此外，除了上述提及过的风险以外，还会有未能预测的风险存在。您应慎重考虑并用清晰的判断能力去评估自己的财政状况及上述各项风险而作出任何买卖数字资产的决定，并承担由此产生的全部损失，我们对此不承担任何责任。</p>
					<h2>敬告：</h2>
					<p>1 您了解本网站仅作为您获取数字资产信息、寻找交易方、就数字资产的交易进行协商及开展交易的场所，本网站不参与您的任何交易，故您应自行谨慎判断确定相关数字资产及/或信息的真实性、合法性和有效性，并自行承担因此产生的责任与损失。</p>
					<p>2 本网站的任何意见、消息、探讨、分析、价格、建议和其他资讯均是一般的市场评论，并不构成投资建议。我们不承担任何因依赖该资讯直接或间接而产生的损失，包括但不限于任何利润损失。</p>
					<p>3 本网站的内容会随时更改并不作另行通知，我们已采取合理措施确保网站资讯的准确性，但并不能保证其准确性程度，亦不会承担任何因本网站上的资讯或因未能链结互联网、传送或接收任何通知和信息时的延误或失败而直接或间接产生的损失。</p>
					<p>4 使用互联网形式的交易系统亦存有风险，包括但不限于软件，硬件和互联网链结的失败等。由于我们不能控制互联网的可靠性和可用性，我们不会对失真，延误和链结失败而承担任何责任。</p>
					<p>5 https://www.viaotc.com/为本网站唯一官方对外信息公布平台；</p>
					<p>6 本网站任何服务均不接受信用卡支付；</p>
					<p>7 禁止使用本网站从事洗钱、走私、商业贿赂等一切非法交易活动，若发现此类事件，本站将采取各种可使用之手段，包括但不限于冻结账户，通知相关权力机关等，我们不承担由此产生的所有责任并保留向相关人士追究责任的权利。</p>					
					<h2>服务内容</h2>
					<p>1.ViaOTC运用自己的系统，通过互联网等方式为用户提供比特币等数字资产的信息发布服务。</p>
					<p>2.用户提供的注册数据，用户同意：</p>
					<p>（1）提供合法、真实、准确的个人资料；</p>
					<p>（2）如有变动，及时更新用户资料。如果用户提供的注册数据不合法、不真实、不准确的，用户需承担因此引起的相应责任及后果，并且ViaOTC保留终止用户使用ViaOTC各项服务的权利。</p>
					<p>3.交易双方在确定交易后，视为交易双方已接收确认价格进行交易，在购买数字资产方支付相关款项后，出售方不应以价格波动作为拒绝放行数字资产的依据。同时在购买数字资产方付款完成后，平台有权根据双方确认的交易信息将数字资产放行至数字资产购买方。</p>
					<h2>服务的提供、修改及终止</h2>
					<p>1.用户在接受ViaOTC各项服务的同时，同意接受ViaOTC提供的各类信息服务。用户在此授权ViaOTC可以向其账户、电子邮件、手机等发送商业信息。</p>
					<p>2.ViaOTC保留随时修改或中断服务而不需通知用户的权利，ViaOTC有权行使修改或中断服务的权利，不需对用户或任何无直接关系的第三方负责。</p>
					<p>3.法律允许范围内，无论在以下何种情况下：信息网络设备维护、信息网络连接故障、电脑、通信或其他系统的故障、电力故障、罢工、劳动争议、暴乱、起义、骚乱、生产力或生产资料不足、火灾、洪水、风暴、爆炸、战争、政府行为、司法行政机关的命令、其他不可抗力或第三方的不作为而造成的服务终止或服务延迟以及用户因此而遭受的损失，ViaOTC不承担责任。</p>
					<p>4.用户对本协议的修改有任何异议或对ViaOTC的服务有任何不满，可以行使以下权利：</p>
					<p>（1）停止使用ViaOTC的网络服务。</p>
					<p>（2）通过客服、支持等渠道告知ViaOTC停止对其服务。结束服务后，用户使用ViaOTC网络服务条款的权利立即终止。在此情况下，ViaOTC没有义务传送任何未处理的消息或未完成的服务给用户或任何无直接关系的第三方。</p>
					<h2>用户信息的保密</h2>
					<p>1.本协议所称之ViaOTC用户信息是指符合法律、法规及相关规定，并符合下述范围的信息：</p>
					<p>（1）用户注册ViaOTC时，向ViaOTC提供的个人信息；</p>
					<p>（2）用户在使用ViaOTC服务、参加网站活动或访问网站网页时，ViaOTC自动接收并记录的用户浏览器端数据，包括但不限于IP地址、网站Cookie中的数据及用户要求取用的网页记录；</p>
					<p>（3）ViaOTC从商业伙伴处合法获取的用户个人信息；</p>
					<p>（4）其它ViaOTC通过合法途径获取的用户个人信息。</p>
					<p>2.ViaOTC承诺未经法定原因或用户事先许可，ViaOTC不会向任何第三方透露用户的密码、姓名、手机号码、证件号码等非公开信息。</p>
					<p>3.在下述法定情况下，用户的个人信息将会被部分或全部披露。</p>
					<p>（1）经用户同意向用户本人或其他第三方披露；</p>
					<p>（2）根据法律、法规等相关规定，或行政机构要求，向行政、司法机构或其他法律规定的第三方披露；</p>
					<p>（3）其他ViaOTC根据法律、法规等相关规定进行的披露。</p>
					<h2>用户权利</h2>
					<p>1.用户的用户名、密码和安全性</p>
					<p>（1）用户名不可重复注册。</p>
					<p>（2）用户一旦注册成功，成为ViaOTC的用户，将得到用户名（用户邮箱）和密码，并对以此组用户名和密码登入系统后所发生的所有活动和事件负责，自行承担一切使用该用户名发布的言语、行为等而直接或间接导致的法律责任。</p>
					<p>（3）用户有义务妥善保管ViaOTC账号、用户名和密码、短信验证码、谷歌验证码，用户将对用户名和密码、和谷歌密钥安全负全部责任。因用户原因导致用户名或密码、谷歌密钥泄露而造成的任何法律后果由用户本人负责，由于用户自身原因泄露这些信息导致的财产损失，本站不负相关责任。由于ViaOTC是交易网站，登录密码、防钓鱼码等不得使用相同密码，否则会有安全隐患，相关责任由用户自身承担。</p>
					<p>（4）用户密码遗失的，可以通过注册电子邮箱发送的连接重置密码。用户若发现任何非法使用用户名或存在其他安全漏洞的情况，应立即告知ViaOTC。</p>
					<p>（5）ViaOTC不会向任何用户索取密码，不会让用户往任何非本站交易中心里提供的帐户、BTC充值地址充值比特币，请大家不要相信任何非ViaOTC官方发布的诈骗信息，往非BTC交易中心提供的账户、地址里充值比特币造成的损失本站不负责任。</p>
					<p>2.用户有权修改其账户个人中心、安全设置中各项可修改信息，自行选择录入介绍性文字，自行决定是否提供非必填项的内容；</p>
					<p>3.用户有权在ViaOTC浏览比特币的信息详情以及交易信息并发表符合国家法律规定、ViaOTC社区规则的文章及观点；</p>
					<p>4.用户有权根据网站相关规定，获得ViaOTC给与的奖励（如手续费按比例返现等）；</p>
					<p>5.用户有权按照ViaOTC发布的活动规则参与ViaOTC组织的各项在线、线下活动（包括各官方平台社区发起的活动）。</p>
					<p>6.用户有权查看其ViaOTC账号下的信息。</p>
					<p>7.用户有权根据ViaOTC网站规定，应用ViaOTC提供的功能进行操作、享受ViaOTC提供的其它各类服务。</p>		
					<h2>用户义务</h2>		
					<p>1.不得利用本站危害国家安全、泄露国家秘密，不得侵犯国家社会集体的和公民的合法权益，不得利用本站制作、复制和传播下列信息：</p>
					<p>（1）煽动抗拒、破坏宪法和法律、行政法规实施的；</p>
					<p>（2）煽动颠覆国家政权，推翻社会主义制度的；</p>
					<p>（3）煽动分裂国家、破坏国家统一的；</p>
					<p>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</p>
					<p>（5）捏造或者歪曲事实，散布谣言，扰乱社会秩序的；</p>
					<p>（6）宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的；</p>
					<p>（7）公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的；</p>
					<p>（8）损害国家机关信誉的；</p>
					<p>（9）其他违反宪法和法律行政法规的；</p>
					<p>（10）进行商业广告行为的。</p>
					<p>2.用户不得通过任何手段恶意注册ViaOTC帐号，包括但不限于以牟利、炒作、套现等为目的多个账号注册。用户亦不得盗用其他用户帐号。如用户违反上述规定，则ViaOTC有权直接采取一切必要的措施，包括但不限于删除用户发布的内容、取消用户在网站获得的星级、荣誉以及虚拟财富，暂停或查封用户帐号，取消因违规所获利益，乃至通过诉讼形式追究用户法律责任等。</p>
					<p>3.禁止用户将ViaOTC以任何形式作为从事各种非法活动的场所、平台或媒介。未经ViaOTC的授权或许可，用户不得借用本站的名义从事任何商业活动，也不得以任何形式将ViaOTC作为从事商业活动的场所、平台或媒介。如用户违反上述规定，则ViaOTC有权直接采取一切必要的措施，包括但不限于删除用户发布的内容、取消用户在网站获得的星级、荣誉以及虚拟财富，暂停或查封用户帐号，取消因违规所获利益，乃至通过诉讼形式追究用户法律责任等。</p>
					<p>4.用户在ViaOTC以各种形式发布的一切信息，均应符合国家法律法规等相关规定及网站相关规定，符合社会公序良俗，并不侵犯任何第三方主体的合法权益，否则用户自行承担因此产生的一切法律后果，且ViaOTC因此受到的损失，有权向用户追偿。</p>						
					<h2>拒绝担保与免责</h2>
					<p>1.ViaOTC作为“网络服务提供者”的第三方平台，不担保网站平台上的信息及服务能充分满足用户的需求。对于用户在接受ViaOTC的服务过程中可能遇到的错误、侮辱、诽谤、不作为、淫秽、色情或亵渎事件，ViaOTC不承担法律责任。</p>
					<p>2.基于互联网的特殊性，ViaOTC也不担保服务不会受中断，对服务的及时性、安全性都不作担保，不承担非因ViaOTC导致的责任。ViaOTC力图使用户能对本站点进行安全访问和使用，但ViaOTC不声明也不保证本站点或其服务器是不含病毒或其它潜在有害因素的；因此用户应使用业界公认的软件查杀任何自ViaOTC下载文件中的病毒。</p>
					<p>3.ViaOTC不对用户所发布信息的保存、修改、删除或储存失败负责。对网站上的非因ViaOTC故意所导致的排字错误、疏忽等不承担责任。ViaOTC有权但无义务，改善或更正本网站任何部分之疏漏、错误。</p>
					<p>4.除非ViaOTC以书面形式明确约定，ViaOTC对于用户以任何方式（包括但不限于包含、经由、连接或下载）从本站点所获得的任何内容信息，包括但不限于广告等，不保证其准确性、完整性、可靠性；对于用户因本站点上的内容信息而购买、获取的任何产品、服务、信息或数据，ViaOTC不承担责任。用户自行承担使用本站点信息内容所导致的风险。</p>
					<p>5.ViaOTC内所有用户所发表的用户评论，仅代表用户个人观点，并不表示本站点赞同其观点或证实其描述，本站点不承担用户评论引发的任何法律责任。</p>
					<p>6.ViaOTC有权删除ViaOTC内各类不符合法律或协议规定的信息，而保留不通知用户的权利。</p>
					<p>7.所有发给用户的通告，ViaOTC都将通过正式的页面公告、站内消息、电子邮件、客服电话、手机短信或常规的信件送达。任何非经ViaOTC正规渠道获得的中奖、优惠等活动或信息，ViaOTC不承担法律责任。</p>
					<p>8.ViaOTC有权根据市场情况调整提现、交易、对冲工具利息等手续费费率，有权决定免费推广期的终止。</p>	
					<h2>拒绝担保与免责</h2>
					<p>1.本协议是ViaOTC网与用户注册成为ViaOTC用户，使用ViaOTC服务之间的重要法律文件，ViaOTC或者用户的任何其他书面或者口头意思表示与本协议不一致的，均应当以本协议为准。</p>	
					<p>2.如果本协议的任何条款被视为不合法、无效或因任何原因而无法执行，则此等规定应视为可分割，不影响任何其它条款的法律效力。</p>	
					<p>3.因用户使用ViaOTC而引起或与之相关的一切争议、权利主张或其它事项，均受中华人民共和国法律的管辖。</p>	
					<p>4.用户和ViaOTC发生争议的，应首先本着诚信原则通过协商加以解决。如果协商不成，则应向ViaOTC所在地人民法院提起诉讼。</p>	
					<p>5.本协议于用户勾选ViaOTC注册页面的网络服务条款并完成注册程序、获得ViaOTC账号和密码时生效，对ViaOTC和用户均具有约束力。</p>					
				</div>
			</div>
		)
		
	}
}

export default Protocal