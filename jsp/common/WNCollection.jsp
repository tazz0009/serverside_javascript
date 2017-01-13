<%@ page pageEncoding = "UTF-8" %>
<%@ include file="./api/WNDefine.jsp" %>
<%!

	static String SEARCH_IP="127.0.0.1";
	static int SEARCH_PORT=7000;
	static String MANAGER_IP="127.0.0.1";
	static int MANAGER_PORT=7800;

	public String[] COLLECTIONS = new String[]{"sample_kms","sample_edu","sample_terms","sample_bbs"};
	public String[] COLLECTIONS_NAME = new String[]{"sample_kms","sample_edu","sample_terms","sample_bbs"};
	public String[] MERGE_COLLECTIONS = new String[]{""};
	public class WNCollection{
	public String[][] MERGE_COLLECTION_INFO = null;
	public String[][] COLLECTION_INFO = null;
		WNCollection(){
			COLLECTION_INFO = new String[][]
			{
			{
			"sample_kms", // set index name
			"sample_kms", // set collection name
			"0,3",  // set pageinfo (start,count)
			"1,0,0,0,0", // set query analyzer (useKMA,isCase,useOriginal,useSynonym, duplcated detection)
			"RANK/DESC,DATE/DESC",  // set sort field (field,order) multi sort '/'
			"basic,rpfmo,100",  // set sort field (field,order) multi sort '/'
			"TITLE,CONTENT,ATTACHCON,ATTACHNAME,WRITER",// set search field
			"DOCID,Date,TITLE,WRITER,USERID,CONTENT,ATTACHNAME,ATTACHEXT,ATTACHCON,LINK,FILELINK,MAPCD,ALIAS",// set document field
			"", // set date range
			"", // set rank range
			"", // set prefix query, example: <fieldname:contains:value1>|<fieldname:contains:value2>/1,  (fieldname:contains:value) and ' ', or '|', not '!' / operator (AND:1, OR:0)
			"", // set collection query (<fieldname:contains:value^weight | value^weight>/option...) and ' ', or '|'
			"", // set boost query (<fieldname:contains:value> | <field3:contains:value>...) and ' ', or '|'
			"", // set filter operation (<fieldname:operator:value>)
			"", // set groupby field(field, count)
			"", // set sort field group(field/order,field/order,...)
			"", // set categoryBoost(fieldname,matchType,boostID,boostKeyword)
			"", // set categoryGroupBy (fieldname:value)
			"", // set categoryQuery (fieldname:value)
			"", // set property group (fieldname,min,max, groupcount)
			"ALIAS", // use check prefix query filed
			"WRITER,USERID", // set use check fast access field
			"", // set multigroupby field
			"", // set auth query (Auth Target Field, Auth Collection, Auth Reference Field, Authority Query)
			"", // set Duplicate Detection Criterion Field, RANK/DESC,DATE/DESC
			"sample_kms" // collection display name
			}
         ,
			{
			"sample_edu", // set index name
			"sample_edu", // set collection name
			"0,3",  // set pageinfo (start,count)
			"1,0,0,0,0", // set query analyzer (useKMA,isCase,useOriginal,useSynonym, duplcated detection)
			"RANK/DESC,DATE/DESC",  // set sort field (field,order) multi sort '/'
			"basic,rpfmo,100",  // set sort field (field,order) multi sort '/'
			"TITLE,CONTENT,ATTACHCON,ATTACHNAME,WRITER",// set search field
			"DOCID,Date,TITLE,WRITER,CONTENT,ATTACHNAME,ATTACHEXT,ATTACHCON,LINK,FILELINK,ALIAS",// set document field
			"", // set date range
			"", // set rank range
			"", // set prefix query, example: <fieldname:contains:value1>|<fieldname:contains:value2>/1,  (fieldname:contains:value) and ' ', or '|', not '!' / operator (AND:1, OR:0)
			"", // set collection query (<fieldname:contains:value^weight | value^weight>/option...) and ' ', or '|'
			"", // set boost query (<fieldname:contains:value> | <field3:contains:value>...) and ' ', or '|'
			"", // set filter operation (<fieldname:operator:value>)
			"", // set groupby field(field, count)
			"", // set sort field group(field/order,field/order,...)
			"", // set categoryBoost(fieldname,matchType,boostID,boostKeyword)
			"", // set categoryGroupBy (fieldname:value)
			"", // set categoryQuery (fieldname:value)
			"", // set property group (fieldname,min,max, groupcount)
			"ALIAS", // use check prefix query filed
			"WRITER", // set use check fast access field
			"", // set multigroupby field
			"", // set auth query (Auth Target Field, Auth Collection, Auth Reference Field, Authority Query)
			"", // set Duplicate Detection Criterion Field, RANK/DESC,DATE/DESC
			"sample_edu" // collection display name
			}
         ,
			{
			"sample_terms", // set index name
			"sample_terms", // set collection name
			"0,3",  // set pageinfo (start,count)
			"1,0,0,0,0", // set query analyzer (useKMA,isCase,useOriginal,useSynonym, duplcated detection)
			"RANK/DESC,DATE/DESC",  // set sort field (field,order) multi sort '/'
			"basic,rpfmo,100",  // set sort field (field,order) multi sort '/'
			"TITLE,CONTENT,ATTACHCON,ATTACHNAME,WRITER",// set search field
			"DOCID,Date,TITLE,WRITER,USERID,EMAIL,DEPT,PHONE,CONTENT,ATTACHNAME,ATTACHCON,ALIAS,TERMS,TOPIC",// set document field
			"", // set date range
			"", // set rank range
			"", // set prefix query, example: <fieldname:contains:value1>|<fieldname:contains:value2>/1,  (fieldname:contains:value) and ' ', or '|', not '!' / operator (AND:1, OR:0)
			"", // set collection query (<fieldname:contains:value^weight | value^weight>/option...) and ' ', or '|'
			"", // set boost query (<fieldname:contains:value> | <field3:contains:value>...) and ' ', or '|'
			"", // set filter operation (<fieldname:operator:value>)
			"", // set groupby field(field, count)
			"", // set sort field group(field/order,field/order,...)
			"", // set categoryBoost(fieldname,matchType,boostID,boostKeyword)
			"", // set categoryGroupBy (fieldname:value)
			"", // set categoryQuery (fieldname:value)
			"", // set property group (fieldname,min,max, groupcount)
			"ALIAS", // use check prefix query filed
			"WRITER,USERID", // set use check fast access field
			"", // set multigroupby field
			"", // set auth query (Auth Target Field, Auth Collection, Auth Reference Field, Authority Query)
			"", // set Duplicate Detection Criterion Field, RANK/DESC,DATE/DESC
			"sample_terms" // collection display name
			}
         ,
			{
			"sample_bbs", // set index name
			"sample_bbs", // set collection name
			"0,3",  // set pageinfo (start,count)
			"1,0,0,0,0", // set query analyzer (useKMA,isCase,useOriginal,useSynonym, duplcated detection)
			"RANK/DESC,DATE/DESC",  // set sort field (field,order) multi sort '/'
			"basic,rpfmo,100",  // set sort field (field,order) multi sort '/'
			"TITLE,CONTENT,ATTACHCON,ATTACHNAME,WRITER",// set search field
			"DOCID,Date,TITLE,WRITER,CONTENT,ATTACHNAME,ATTACHEXT,ATTACHCON,LINK,FILELINK,ALIAS",// set document field
			"", // set date range
			"", // set rank range
			"", // set prefix query, example: <fieldname:contains:value1>|<fieldname:contains:value2>/1,  (fieldname:contains:value) and ' ', or '|', not '!' / operator (AND:1, OR:0)
			"", // set collection query (<fieldname:contains:value^weight | value^weight>/option...) and ' ', or '|'
			"", // set boost query (<fieldname:contains:value> | <field3:contains:value>...) and ' ', or '|'
			"", // set filter operation (<fieldname:operator:value>)
			"", // set groupby field(field, count)
			"", // set sort field group(field/order,field/order,...)
			"", // set categoryBoost(fieldname,matchType,boostID,boostKeyword)
			"", // set categoryGroupBy (fieldname:value)
			"", // set categoryQuery (fieldname:value)
			"", // set property group (fieldname,min,max, groupcount)
			"ALIAS", // use check prefix query filed
			"WRITER", // set use check fast access field
			"", // set multigroupby field
			"", // set auth query (Auth Target Field, Auth Collection, Auth Reference Field, Authority Query)
			"", // set Duplicate Detection Criterion Field, RANK/DESC,DATE/DESC
			"sample_bbs" // collection display name
			}
			};
		}
	}
%>