import express from "express";

export async function handlerValidate(req: express.Request, res: express.Response) {
    type parameters = {
        body: string;
    }
    
    try {
        const params: parameters = req.body;

        if (!params.body) {
            return res.status(400).json({ error: "Something went wrong" });
        }
        if (params.body.length > 140) {
            return res.status(400).json({ error: "Chirp is too long" });
        }
        let cleaned = cleanChirp(params.body);
        return res.status(200).json({
            cleanedBody: cleaned
        });
    } catch (error) {
        return res.status(400).json({
            error: "Something went wrong"
        })
    }
}

function cleanChirp(chirp: string): string {
    const profanity = ["kerfuffle", "sharbert", "fornax"];

    let split = chirp.split(" ")
    for (let i = 0; i < split.length; i++) {
        if (profanity.includes(split[i].toLowerCase())) {
            split[i] = "****";
        };
    }
    return split.join(" ")
}