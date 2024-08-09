import moment from "moment";

function dateParseBr(value: string | Date, format = "YYYY-MM-DDTHH:mm:ssBRT") {
	moment.locale("pt-br");
	return moment(value).format(format);
}

function uuidWithDateBr() {
	return self.crypto.randomUUID() + "-" + dateParseBr(new Date());
}

export default dateParseBr;

export { uuidWithDateBr };
