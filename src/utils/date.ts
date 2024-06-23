import moment from "moment";

function dateParseBr(value: string | Date, format = "YYYY-MM-DDTHH:mm:ssBRT") {
	moment.locale("pt-br");
	return moment(value).format(format);
}

export default dateParseBr;
