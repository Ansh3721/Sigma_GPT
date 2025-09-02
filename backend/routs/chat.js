import express from "express";
import Thread from "../models/thread.js";
import getGeminiResponse from "../utils/gemini.js";

const router = express.Router();

//test route
// router.post("/test",async (req,res)=>{
//     try{
//         const thread = new Thread ({
//             threadId: "test123",
//             title: "Test Thread",
//             messages: [{role: "user", content: "Hello, this is a test message."}]
//         });
//         const response = await thread.save();
//         res.status(200).send(response);
//     }catch(err){
//         console.log(err);
//     }
// });

//get all threads
router.get("/thread",async (req,res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt: -1});
        res.json(threads);
    }catch(err){
        console.log(err);
    }   
});

//specific thread
router.get("/thread/:threadId",async (req,res)=>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread) {
            return res.status(404).json("Thread not found");
        }
        res.status(200).json(thread.messages);
    }catch(err){
        console.log(err);
    }   
});

//delete specific thread
router.delete("/thread/:threadId",async (req,res)=>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOneAndDelete({threadId});
        if(!thread) {
            return res.status(404).json("Thread not found");
        }
        res.status(200).json("Thread deleted successfully");
    }catch(err){
        console.log(err);
    }   
});

//create new chat 
router.post("/chat",async (req,res)=>{
    const {threadId, message} = req.body;
    if(!threadId || !message){
        return res.status(400).json("mising required fields");
    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            //create new thread
            thread = new Thread({
                threadId,
                title: message,
                messages: [{role: "user", content: message}]
            });
        }else{
            thread.messages.push({role: "user", content: message});
        }
        const geminiResponse = await getGeminiResponse(thread.messages);

        thread.messages.push({role: "assistant", content: geminiResponse});
        thread.updatedAt = Date.now();

        await thread.save();
        res.json({reply:geminiResponse});

    }catch(err){
        console.log(err);
        res.status(500).json("something went wrong");
    }
});

export default router;