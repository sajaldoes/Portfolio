---
title: "Stock Market Real Time Data Streaming using Kafka"
description: 
dateString: September 2023 - September 2023
draft: false
tags: ["Kafka", "Amazon Web Services (AWS)", "Python"]
showtoc: false
weight: 390
cover: 
category: projects
--- 
👩‍💻 [**Source Code**](https://github.com/sajaldoes/stock_market_kafka) 

## Introduction 
This is an End-To-End Data Engineering Project on Real-Time Stock Market Data using Kafka.

I have used different technologies such as Python, Amazon Web Services (AWS), Apache Kafka, Glue, Athena, and SQL.

## Architecture 
![](/projects/kafka_stock_market/Architecture.jpg)

## Technology Used
- Programming Language - Python
- Amazon Web Service (AWS)
1. S3 (Simple Storage Service)
2. Athena
3. Glue Crawler
4. Glue Catalog
5. EC2
- Apache Kafka


## Kafka commands

```bash
wget https://downloads.apache.org/kafka/3.3.1/kafka_2.12-3.3.1.tgz
```
```bash
tar -xvf kafka_2.12-3.3.1.tgz
```

Install Java
-----------------------
```bash
sudo yum install java-1.8.0-openjdk
```  
Check Java version  
```bash
java -version
```


Start Zoo-keeper:
-------------------------------
```bash
cd kafka_2.12-3.3.1
``` 
```bash 
bin/zookeeper-server-start.sh config/zookeeper.properties
```

Open another window to start kafka  
But first ssh to to your ec2 machine as done above


Start Kafka-server:
----------------------------------------
Duplicate the session & enter in a new console -

```bash
export KAFKA_HEAP_OPTS="-Xmx256M -Xms128M"
```    
```bash    
bin/kafka-server-start.sh config/server.properties
```  

It is pointing to private server , change server.properties so that it can run in public IP 

To do this , you can follow any of the 2 approaches shared below --
Do a `sudo nano config/server.properties` - change ADVERTISED_LISTENERS to public ip of the EC2 instance


Create the topic:
-----------------------------
Duplicate the session & enter in a new console -  
  
```bash
bin/kafka-topics.sh --create --topic demo_test --bootstrap-server {Public IP of your EC2 Instance:9092} --replication-factor 1 --partitions 1
```  

Start Producer:
--------------------------
```bash
bin/kafka-console-producer.sh --topic demo_test --bootstrap-server {Public IP of your EC2 Instance:9092}
```   

Start Consumer:
-------------------------
Duplicate the session & enter in a new console -

```bash
bin/kafka-console-consumer.sh --topic demo_test --bootstrap-server {Public IP of your EC2 Instance:9092}
```  