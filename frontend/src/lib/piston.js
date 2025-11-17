

// piston API  is a service for code excution
const PISTON_API="https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS={
    javascript:{language:"javascript",version:"18.15.0"},
    python:{language:"python",version:"3.10.0"},
    java:{language:"java",version:"15.0.2"},
};

/**
 * @param {string} language - programming langauge
 * @param {string} code - source code to excute
 * @return {Promise<{success:boolean,output?string,error?:string}>}
 */

export async function excuteCode(language,code){
    try{
        const languagConfig=LANGUAGE_VERSIONS[language];

        if(!languagConfig){
            return{
                success:false,
                error:`Unsupported language: ${language}`,
            };
        }

        const response=await fetch(`${PISTON_API}/execute`,{
            methon:"POST",
            headers:{
                "content-type":"application/json",
            },
            body:JSON.stringify({
                language:languageConfig.language,
                version:languageConfig.version,
                files:[
                    {
                        name:`main.${getFileExtension(language)}`,
                        content:code,
                    },
                ],
            }),
        });

        if(!response.ok){
            return {
                success:false,
                error:`HTTP error! status: ${response.status}`,
            };
        }

        const data=await response.json();

        const output=data.run.output || "";
        const stderr=data.run.stderr || "";

        if(stderr){
            return {
                success:false,
                output:output,
                error:stderr,
            };
        }

        return{
            success:true,
            output: output || "No Output",
        };
    }catch(error){
        return {
            success:false,
            error:`Failed to excute code: ${error.messgae}`,
        };
    }
}

function getFileExtension(language){
    const extensions={
        javascript:"js",
        python:"py",
        java:"java",
    };
};