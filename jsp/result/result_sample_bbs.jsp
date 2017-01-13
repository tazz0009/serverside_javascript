<%@ page contentType="text/html; charset=UTF-8"%><%
/*
* subject: sample_bbs 페이지
* @original author: SearchTool
*/
	thisCollection = "sample_bbs";
	if (collection.equals("ALL") || collection.equals(thisCollection)) {
		int count = wnsearch.getResultCount(thisCollection);
		int thisTotalCount = wnsearch.getResultTotalCount(thisCollection);

		if ( thisTotalCount > 0 ) {
%>
			<div class="sectit">
				<h2><%=wnsearch.getCollectionKorName(thisCollection)%></h2>
				<p>| 검색결과 <%=numberFormat(thisTotalCount)%>건</p>
			</div>
<%
			for(int idx = 0; idx < count; idx ++) {
                String DOCID                    = wnsearch.getField(thisCollection,"DOCID",idx,false);
                String DATE                     = wnsearch.getField(thisCollection,"Date",idx,false);
                String TITLE                    = wnsearch.getField(thisCollection,"TITLE",idx,false);
                String WRITER                   = wnsearch.getField(thisCollection,"WRITER",idx,false);
                String CONTENT                  = wnsearch.getField(thisCollection,"CONTENT",idx,false);
                String ATTACHNAME               = wnsearch.getField(thisCollection,"ATTACHNAME",idx,false);
                String ATTACHEXT                = wnsearch.getField(thisCollection,"ATTACHEXT",idx,false);
                String ATTACHCON                = wnsearch.getField(thisCollection,"ATTACHCON",idx,false);
                String LINK                     = wnsearch.getField(thisCollection,"LINK",idx,false);
                String FILELINK                 = wnsearch.getField(thisCollection,"FILELINK",idx,false);
                String ALIAS                    = wnsearch.getField(thisCollection,"ALIAS",idx,false);
				TITLE= wnsearch.getKeywordHl(TITLE,"<font color=red>","</font>");
				CONTENT= wnsearch.getKeywordHl(CONTENT,"<font color=red>","</font>");
				ATTACHCON= wnsearch.getKeywordHl(ATTACHCON,"<font color=red>","</font>");
            String URL = "URL 정책에 맞게 작성해야 합니다.";

%>
				<dl class="resultsty1">
					<dt>
						<p class="date"><%=DATE%></p>
						<p class="fl"><a href="#"><%=TITLE%></a></p>
					</dt>
					<dd class="lh18"><%=CONTENT%></dd>
              <dd class="lh18"> DOCID : <%=DOCID%></dd>
              <dd class="lh18"> Date : <%=DATE%></dd>
              <dd class="lh18"> ATTACHNAME : <%=ATTACHNAME%></dd>
              <dd class="lh18"> ATTACHEXT : <%=ATTACHEXT%></dd>
              <dd class="lh18"> ATTACHCON : <%=ATTACHCON%></dd>
              <dd class="lh18"> LINK : <%=LINK%></dd>
              <dd class="lh18"> FILELINK : <%=FILELINK%></dd>
              <dd class="lh18"> ALIAS : <%=ALIAS%></dd>
				</dl>
 <%
			}

			if ( collection.equals("ALL") && thisTotalCount > TOTALVIEWCOUNT ) {
%>
				<div class="moreresult"><a href="#none" onClick="javascript:doCollection('<%=thisCollection%>');">더보기</a></div>
<%
			}
		}
	}
%>