package com.example.students_service.utility;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class Message {

    private static ResponseEntity<Map<String, Object>> buildResponse(
            String message,
            Object data,
            int status,
            HttpStatus httpStatus
    ) {
        Map<String, Object> res = new HashMap<>();
        res.put("message", message);
        res.put("status", status);

        if (data != null) {
            res.put("data", data);
        }

        return new ResponseEntity<>(res, httpStatus);
    }

    public static ResponseEntity<Map<String,Object>> success(String message,int status){
        return buildResponse(message,null,status,HttpStatus.OK);
    }

    public static ResponseEntity<Map<String,Object>> getData(String message,Object data,int status){
        return buildResponse(message,data,status,HttpStatus.OK);
    }

    public static ResponseEntity<Map<String,Object>> error(String message,int status){
        return buildResponse(message,null,status,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}