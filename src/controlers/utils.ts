export function doQry(cmd: string, data: any): string {
    let strData = cmd;
    strData += data.table;
    delete(data.table);
    let strNames = " (";
    let strValues = " VALUE (";
    let sep = "";
    Object.keys(data).forEach(function(key) {
        strNames+= sep + '`' + key + '`';
        strValues+= sep + "'" + data[key] + "'";
        sep = ", "
    });
    strNames  += " )"
    strValues += " )"
    return strData+strNames+strValues
} 
export function doWhere( data: any ): string {
    let strWhere = " WHERE ";
    let sep = "";
    console.log (data);
    Object.keys(data).forEach(function(key) {
        strWhere += sep + '`' + key + "`='" + data[key] + "'";
        sep = " and "
    });
    return strWhere;
} 
export function doUpdate( data: any ): string {
    let strUpdate = "UPDATE "+data.table+" SET ";
    console.log (data);
    const {id} = data; 
    let sep = "";
    delete(data.table);
    delete(data.id);
    console.log (data);
    Object.keys(data).forEach(function(key) {
        strUpdate += sep + '`' + key + "`='" + data[key] + "'";
        sep = ", "
    });
    strUpdate += " WHERE `id`='"+id+"'";
    return strUpdate;
} 
