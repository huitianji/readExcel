const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')
const beautify = require('js-beautify').js_beautify

const transformData = (data) => {
    const keyMap = {
        '排名': 'ranking',
        '代理人姓名': 'name',
        '代理人手机号': 'mobile',
        '放款金额': 'loanAmount'
    }
    return data.map(item => {
        const result = {}
        //console.log(data,"{{{====")
        Object.keys(keyMap).forEach(key => {
            if (keyMap[key] === 'name') {
                const value = item[key]
                // let name = value
                //   //console.log(item,"[[[")
                // if(value.length==2){
                //   name = '*'+ value.substr(-1);
                // }
                // if(value.length==3){
                //   name = '*'+ value.substr(-2);
                // }
                // if(value.length>3){
                //     var xing= "";
                //     for(var i = 0; i<value.length-2; i++){
                //         xing=xing+"*";
                //     }
                //     name = value.substr(0,1)+xing+value.substr(-1);
                // }
                // result[keyMap[key]] = name
                result[keyMap[key]] = value
            } else if (keyMap[key] === 'time') {
                // result[keyMap[key]] = item[key].slice(5, -3)
                //console.log(XLSX.SSF.parse_date_code(item[key]));
                const { m, d, H, M } = XLSX.SSF.parse_date_code(item[key])
                const mm = `0${m}`.slice(-2)
                const dd = `0${d}`.slice(-2)
                const MM = `0${M}`.slice(-2)
                const HH = `0${H}`.slice(-2)
                result[keyMap[key]] = `${mm}-${dd} ${HH}:${MM}`
            }
            else if (keyMap[key] === 'loanAmount') {
                let reg = /(?=(\B)(\d{3})+$)/g;
                const value = item[key]
                //console.log(value + "")
                result[keyMap[key]] = String(value).replace(reg,',');
            }
            else {
                result[keyMap[key]] = item[key]
            }
            // else if (keyMap[key] === 'mobile') {
            //   // result[keyMap[key]] = item[key].slice(-4)
            //     result[keyMap[key]] = item[key]
            // } else {
            //   result[keyMap[key]] = `${item[key]}.00`
            // }
        })
        return result
    })
}

async function read (file) {
    // console.log(__dirname, path.join("./"+__dirname))
    const binary = XLSX.readFile(__dirname + '/最佳代理人.xlsx', {
        type: 'binary'
    })
    const json = XLSX.utils.sheet_to_json(binary.Sheets[binary.SheetNames[0]])
    //console.log(json,"===")
    fs.writeFile(path.join(__dirname, '/rankResult2.js'), beautify(JSON.stringify(transformData(json)), { indent_size: 2 }), (err) => {
        if (err) {
            reject(err)
            console.log(err)
        }
        console.log(`success`)
    })
}

read()
