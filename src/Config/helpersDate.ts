import moment from "moment";

const formatlocaldate = (date:any) => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const hours = now.getHours();

    const formattedDate = moment(date).format('YYYY-MM-DD');
    const dateTimeString = `${formattedDate} ${hours}:${minutes}:${seconds}`;

    return dateTimeString;
};

export default formatlocaldate;
