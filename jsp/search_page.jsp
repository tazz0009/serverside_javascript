<%@ page contentType="text/html; charset=UTF-8"%><%@ include file="./common/api/WNSearch.jsp" %><% request.setCharacterEncoding("UTF-8");%><%
    /*
     * subject: 검색 메인 페이지
     * @original author: SearchTool
     */

    //실시간 검색어 화면 출력 여부 체크
    boolean isRealTimeKeyword = false;
    //오타 후 추천 검색어 화면 출력 여부 체크
    boolean useSuggestedQuery = true;
    String suggestQuery = "";

    //디버깅 보기 설정
    boolean isDebug = false;

    int TOTALVIEWCOUNT = 3;    //통합검색시 출력건수
    int COLLECTIONVIEWCOUNT = 10;    //더보기시 출력건수

	String START_DATE = "1970.01.01";	// 기본 시작일

	// 결과 시작 넘버
    int startCount = parseInt(getCheckReqXSS(request, "startCount", "0"), 0);	//시작 번호
    String query = getCheckReqXSS(request, "query", "");						//검색어
    String collection = getCheckReqXSS(request, "collection", "ALL");			//컬렉션이름
    String rt = getCheckReqXSS(request, "rt", "");								//결과내 재검색 체크필드
    String rt2 = getCheckReqXSS(request, "rt2", "");							//결과내 재검색 체크필드
	   String reQuery = getCheckReqXSS(request, "reQuery", "");					//결과내 재검색 체크필드
    String realQuery = getCheckReqXSS(request, "realQuery", "");				//결과내 검색어
    String sort = getCheckReqXSS(request, "sort", "RANK");						//정렬필드
    String range = getCheckReqXSS(request, "range", "A");						//기간관련필드
    String startDate = getCheckReqXSS(request, "startDate", START_DATE);		//시작날짜
    String endDate = getCheckReqXSS(request, "endDate", getCurrentDate());		//끝날짜
	   String writer = getCheckReqXSS(request, "writer", "");						//작성자
	   String searchField = getCheckReqXSS(request, "searchField", "");			//검색필드
	   String strOperation  = "" ;												//operation 조건 필드
    String exquery = "" ;													//exquery 조건 필드
    int totalCount = 0;

    String[] searchFields = null;

	// 상세검색 검색 필드 설정이 되었을때
    if (!searchField.equals("")) {
		// 작성자
		if (!writer.equals("")) {
			exquery = "<WRITER:" + writer + ">";
		}
	} else {
		searchField = "ALL";
	}

    String[] collections = null;
    if(collection.equals("ALL")) { //통합검색인 경우
        collections = COLLECTIONS;
    } else {                        //개별검색인 경우
        collections = new String[] { collection };
    }

	if (reQuery.equals("1")) {
		realQuery = query + " " + realQuery;
	} else if (!reQuery.equals("2")) {
		realQuery = query;
	}

    WNSearch wnsearch = new WNSearch(isDebug,false, collections, searchFields);

    int viewResultCount = COLLECTIONVIEWCOUNT;
    if ( collection.equals("ALL") ||  collection.equals("") )
        viewResultCount = TOTALVIEWCOUNT;

    for (int i = 0; i < collections.length; i++) {

        //출력건수
        wnsearch.setCollectionInfoValue(collections[i], PAGE_INFO, startCount+","+viewResultCount);

        //검색어가 없으면 DATE_RANGE 로 전체 데이터 출력
        if (!query.equals("") ) {
              wnsearch.setCollectionInfoValue(collections[i], SORT_FIELD, sort + "/DESC");
        } else {
              wnsearch.setCollectionInfoValue(collections[i], DATE_RANGE, START_DATE.replaceAll("[.]","/") + ",2030/12/31,-");
              wnsearch.setCollectionInfoValue(collections[i], SORT_FIELD, "RANK/DESC,DATE/DESC");
        }

        //searchField 값이 있으면 설정, 없으면 기본검색필드
        if (!searchField.equals("") && !searchField.equals("WRITER") && searchField.indexOf("ALL") == -1 ) {
			wnsearch.setCollectionInfoValue(collections[i], SEARCH_FIELD, searchField);
		}

        //operation 설정
        if (!strOperation.equals("")) {
			wnsearch.setCollectionInfoValue(collections[i], FILTER_OPERATION, strOperation);
		}

        //exquery 설정
        if (!exquery.equals("")) {
			wnsearch.setCollectionInfoValue(collections[i], EXQUERY_FIELD, exquery);
		}

        //기간 설정 , 날짜가 모두 있을때
        if (!startDate.equals("")  && !endDate.equals("") ) {
             wnsearch.setCollectionInfoValue(collections[i], DATE_RANGE, startDate.replaceAll("[.]","/") + "," + endDate.replaceAll("[.]","/") + ",-");
        }
    };

    wnsearch.search(realQuery, isRealTimeKeyword, CONNECTION_CLOSE, useSuggestedQuery);

     // 디버그 메시지 출력
    String debugMsg = wnsearch.printDebug() != null ? wnsearch.printDebug().trim() : "";
    if ( !debugMsg.trim().equals("")) {
         out.println(debugMsg);
    }

     // 전체건수 구하기
    if ( collection.equals("ALL") ) {
        for (int i = 0; i < collections.length; i++) {
           totalCount += wnsearch.getResultTotalCount(collections[i]);
        }
    } else {
      //개별건수 구하기
        totalCount = wnsearch.getResultTotalCount(collection);
    }

    String thisCollection = "";
    if(useSuggestedQuery) {
       suggestQuery = wnsearch.suggestedQuery;
    }
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>통합검색</title>
<link rel="stylesheet" type="text/css" href="css/search.css" >
<link rel="stylesheet" type="text/css" href="css/jquery-ui.css" >
<link rel="stylesheet" type="text/css" href="ark/css/ark.css" media="screen" >
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery-ui.min.js"></script>
<script type="text/javascript" src="ark/js/beta.fix.js"></script>
<script type="text/javascript" src="ark/js/ark.js"></script>
<script type="text/javascript" src="js/datepicker.js"></script>
<script type="text/javascript" src="js/search.js"></script><!--  검색관련 js -->
<script type="text/javascript">
<!--
$(document).ready(function() {
	// 기간 달력 설정
	$("#startDate").datepicker({dateFormat: "yy.mm.dd"});
	$("#endDate").datepicker({dateFormat: "yy.mm.dd"});

    getPopkeyword();
	// 내가 찾은 검색어
	getMyKeyword("<%=query%>", <%=totalCount%>);
});


function getPopkeyword() {

	var target		= "popword";
	var range		= "D";
	var collection  = "_ALL_";
    var datatype   = "text";
	$.ajax({
	  type: "POST",
	  url: "./popword/popword.jsp",
	  dataType: datatype,
	  data: { "target" : target, "range" : range, "collection" : collection , "datatype" : datatype },
	  success: function(text) {
     text = trim(text);
     var xml = $.parseXML(text);
		var str = "<li class='tit'>";
		str += "<div class='timg'><img src='images/tit_popu.gif' alt='인기검색어' /></div>";
		str += "</li>";

		$(xml).find("Query").each(function(){
 			str += "<li class='ranking'>";
			str += "	<ul>";
			str += "		<li class='ranktxt'><img src='images/"+ $(this).attr("id")+".gif' alt='' /> <a href='#none' onclick=\"javascript:doKeyword('" + $(this).text() + "');\">" + $(this).text() + "</a></li>";
			str += "		<li class='rankico'>";

			if ($(this).attr("updown") == "U") {
				str += "<img src='images/ico_up.gif' alt='상승' />";
			} else if ($(this).attr("updown") == "D") {
				str += "<img src='images/ico_down.gif' alt='하락' />";
			} else if ($(this).attr("updown") == "N") {
				str += "<img src='images/ico_new.gif' alt='신규' />";
			} else if ($(this).attr("updown") == "C") {
				str += "-";
			}

			str += "		</li>";
			str += "		<li class='rankstep'>" + $(this).attr("count") + "</li>";
			str += "		";
			str += "	</ul>";
			str += "</li>";
		});

		$("#popword").html(str);
	  }
	});

}

//-->

</script>

</head>
<body>
<div style="width:985px; margin:0 auto;">
	<form name="search" id="search" action="<%=request.getRequestURI()%>" method="POST">
		<input type="hidden" name="startCount" value="0">
		<input type="hidden" name="sort" value="<%=sort%>">
		<input type="hidden" name="collection" value="<%=collection%>">
		<input type="hidden" name="range" value="<%=range%>">
		<input type="hidden" name="startDate" value="<%=startDate%>">
		<input type="hidden" name="endDate"value="<%=endDate%>">
		<input type="hidden" name="searchField"value="<%=searchField%>">
		<input type="hidden" name="reQuery" />
		<input type="hidden" name="realQuery" value="<%=realQuery%>" />
		<div id="search_top">
			<div class="nuttop">
            <ul>
				<li class="logo"><a href="./index.jsp"><img src="images/logo.gif" alt="와이즈넛" /></a></li>
				<li class="keyin">
					<input name="query" id="query" type="text" value="<%=query%>" onKeypress="javascript:pressCheck((event),this);" autocomplete="off"/>
				</li>
				<li class="btn"><a href="#" onClick="javascript:doSearch();" title="검색"><img src="images/btn_search2.gif" alt="검색" /></a></li>
				<li class="btndsearch"><label><input name="reChk" id="reChk" onClick="checkReSearch();" type="checkbox" /> 결과내재검색</label></li>
            </ul>
			<!-- ARK search suggest -->
			<div id="ark"></div>
           </div>
		</div>
	</form>
	<!--div id="search_auto">
		<div class="auto">
			<div id="ark_wrap">
				<div id="ark_up"><img id="ark_img_up"></div>
				<div id="ark_down"><img id="ark_img_down"></div>
				<div id="ark_sub_wrap"/></div>
			<div>
		</div>
	</div-->

	<div class="mainwrap">
		<div id="search_leftap">
			<ul class="marginbottom20">
				<li class="lefttap lefttapsty<%= collection.equals("ALL") ? "11" : "2" %> selleft2"><a href="#none" onClick="javascript:doCollection('ALL');">통합검색</a></li>

				<% for (int i = 0; i < COLLECTIONS.length; i++) {%>
					<li class="lefttap lefttapsty<%=collection.equals(COLLECTIONS[i]) ? "11" : "2" %> selleft2"><a href="#none" onClick="javascript:doCollection('<%=COLLECTIONS[i]%>');"><%=wnsearch.getCollectionKorName(COLLECTIONS[i])%></a></li>
				<% } %>
			</ul>
			<ul class="searchopt">
				<li class="tit"><img src="images/tit_lineup.gif" alt="정렬" /></li>
				<li class="cont">
					<input name="" type="radio" value="RANK" onclick="doSorting(this.value);" <%=sort.equals("RANK") ? "checked" : ""%> />정확도순
					<span class="divi1">|</span>
					<input name="" type="radio" value="DATE" onclick="doSorting(this.value);" <%=sort.equals("DATE") ? "checked" : ""%> />최신순
				</li>
			</ul>
			<ul class="searchopt">
				<li class="tit"><img src="images/tit_term.gif" alt="기간" /></li>
				<li class="cont2">
					<div class="termsty">
						<ul>
							<li class="divi"><a href="#none" onClick="javascript:setDate('A');"><img id="range1" src="images/btn_term<%=range.equals("A") ? "12" : "1"%>.gif" alt="전체" /></a></li>
							<li class="divi"><a href="#none" onClick="javascript:setDate('D');"><img id="range2" src="images/btn_term<%=range.equals("D") ? "22" : "2"%>.gif" alt="오늘" /></a></li>
							<li class="divi"><a href="#none" onClick="javascript:setDate('W');"><img id="range3" src="images/btn_term<%=range.equals("W") ? "32" : "3"%>.gif" alt="1주" /></a></li>
							<li class="divi"><a href="#none" onClick="javascript:setDate('M');"><img id="range4" src="images/btn_term<%=range.equals("M") ? "42" : "4"%>.gif" alt="1달" /></a></li>
							<li class="dindate"><input name="startDate" id="startDate" type="text" value="<%=startDate %>" readonly="true"/> ~ <input name="endDate" id="endDate" type="text" value="<%=endDate%>" readonly="true"/></li>
							<li style="width:134px; height:16px;padding:3px 0;float:left; text-align:right;"><a href="#none" onClick="javascript:doRange();"><img src="images/btn_apply.gif" alt="적용" /></a>
							<input type="hidden" name="range" id="range" value="<%=range%>">
							</li>
						</ul>
					</div>
				</li>
			</ul>
			<ul class="searchopt">
				<li class="tit"><img src="images/tit_area.gif" alt="영역" /></li>
				<li class="cont2">
					<div class="areasty">
						<ul>
							<li class="divi2"><a href="#none" onClick="doSearchField('ALL');"><img src="images/btn_area<%=searchField.equals("ALL") ? "12" : "11"%>.gif" alt="전체" /></a></li>
							<li class="divi"><a href="#none" onClick="doSearchField('TITLE');"><img src="images/btn_area<%=searchField.equals("TITLE") ? "22" : "21"%>.gif" alt="제목" /></a></li>
							<li class="divi"><a href="#none" onClick="doSearchField('CONTENT');"><img src="images/btn_area<%=searchField.equals("CONTENT") ? "32" : "31"%>.gif" alt="본문" /></a></li>
							<li class="divi"><a href="#none" onClick="doSearchField('WRITER');"><img src="images/btn_area<%=searchField.equals("WRITER") ? "42" : "41"%>.gif" alt="작성자" /></a></li>
							<li class="divi"><a href="#none" onClick="doSearchField('ATTACHCON');"><img src="images/btn_area<%=searchField.equals("ATTACHCON") ? "52" : "51"%>.gif" alt="첨부내용" /></a></li>
						</ul>
					</div>
				</li>
			</ul>
		</div>


		<div id="search_result">
			<% if (totalCount > 0) { %>
				<div class="resultall">‘<%=query%>’에 대한 검색결과는 <span>총<%=numberFormat(totalCount)%>건</span>입니다.</div>
				<div id="spell"><script>getSpell('<%=suggestQuery%>');</script></div>

<%@ include file="./result/result_sample_kms.jsp" %><!-- -->
<%@ include file="./result/result_sample_edu.jsp" %><!-- -->
<%@ include file="./result/result_sample_terms.jsp" %><!-- -->
<%@ include file="./result/result_sample_bbs.jsp" %><!-- -->
				<!-- paginate -->
				<% if (!collection.equals("ALL") && totalCount > TOTALVIEWCOUNT) { %>
					<div class="paginate">
							<%=wnsearch.getPageLinks(startCount , totalCount, 10, 10)%>
					</div>
				<% } %>
				<!-- //paginate -->

			<% } else { %>
				<div id="spell"><script>getSpell('<%=suggestQuery%>');</script></div>
				<div class="noresult">
					<p>'<%=query%>'</p>
				</div>
			<% } %>
		</div>
		<!-- right -->
		<div id="search_optional">
			<ul class="popu" id="popword">
			</ul>
			<ul class="mykeyword" id="mykeyword">
			</ul>
		</div>
	</div>

	<div id="search_footer">
		Copyright ⓒ WISEnut, Inc., All rights Reserved.
	</div>
</div>
</body>
</html>
<%
	if ( wnsearch != null ) {
		wnsearch.closeServer();
	}
%>