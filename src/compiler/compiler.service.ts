import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class CompilerService {
    constructor(private http: HttpService) { }
    private URL = 'https://api.jdoodle.com/v1/execute';
    private config = (script: string, lang: string, version: string) => ({
        script,
        language: lang,
        versionIndex: version,
        clientId: process.env.clientId,
        clientSecret: process.env.ClientSecret
    });

    getResult(script: string, lang: string, version: string): Promise<BodyResponse> {
        let obj = this.config(script, lang, version);
        return new Promise((ok, err) => this.http.post(this.URL, obj).subscribe({
            next: (res: any) => ok(res.data),
            error: e => err(e)
        }));
    }

    callFuntion(text: string, name: string[], param: string[]) {
        if (!name[0] && !param[0]) return { text, func: [] };

        let func = [];
        name = (name as string[]).map((e, i) => {
            if (/[^\w$]/gi.test(e)) throw 'Invalid Function name';
            let function_ = e + (param[i] ? `(${param[i]})` : '');
            func.push(function_);
            return `console.log(${function_});`;
        });

        return {
            text: text + '\n' + name.join('\n'),
            func
        };
    }

    preparationResult(obj: BodyResponse, func: any, val: any) {
        if (!obj.output) return;
        if (this.isError(obj.output)) {
            obj.statusCode = 400;
            obj.cpuTime = undefined;
            obj.memory = undefined;
            obj.error = obj.output.split('\n').find(e => this.isError(e));
        } else {
            let arr = obj.output.split('\n').filter(Boolean);
            obj.res = arr.map((result, i) => ({ functionName: func[i], returning: result, log: `${result} == ${val[i]}`, bool: this.clearSpace(result) == this.clearSpace(val[i]) }));
        }
    }

    parseJsons(...data: any): any[] {
        return data.map(e => {
            try { e = JSON.parse(e); } catch (e) { }
            return e;
        });
    }
    convertToArrays(...data: any): any[] {
        return data.map(e => [[e], e][+Array.isArray(e)]);
    }
    isError(data: string) {
        return /Error|Warning/.test(data);
    }

    clearSpace(data: any) {
        try {
            data.replace(/\s*/g, '');
        } catch (e) {
            console.log('{clearSpace}: ', e);
        }
    }
}

export interface Success {
    output: string;
    statusCode: number,
    memory: string,
    cpuTime: string;
}
export interface Failed {
    error: string;
    statusCode: number;
}
export interface BodyResponse extends Success, Failed {
    res: BodyKeyRes[];
}
export interface BodyKeyRes {
    functionName: string;
    returning: string;
    log: string;
    bool: boolean;
}