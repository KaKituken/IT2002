# ? Cross-origin Resource Sharing - here it allows the view and core applications deployed on different ports to communicate. No need to know anything about it since it's only used once
from flask_cors import CORS, cross_origin
# ? Python's built-in library for JSON operations. Here, is used to convert JSON strings into Python dictionaries and vice-versa
import json
# ? flask - library used to write REST API endpoints (functions in simple words) to communicate with the client (view) application's interactions
# ? request - is the default object used in the flask endpoints to get data from the requests
# ? Response - is the default HTTP Response object, defining the format of the returned data by this api
from flask import Flask, request, Response, jsonify
# ? sqlalchemy is the main library we'll use here to interact with PostgresQL DBMS
import sqlalchemy
# ? Just a class to help while coding by suggesting methods etc. Can be totally removed if wanted, no change
from typing import Dict
import hashlib


# ? web-based applications written in flask are simply called apps are initialized in this format from the Flask base class. You may see the contents of `__name__` by hovering on it while debugging if you're curious
app = Flask(__name__)

# ? Just enabling the flask app to be able to communicate with any request source
CORS(app)

# ? building our `engine` object from a custom configuration string
# ? for this project, we'll use the default postgres user, on a database called `postgres` deployed on the same machine
YOUR_POSTGRES_PASSWORD = "JUNjun11"
#YOUR_POSTGRES_PASSWORD = "Jishuhou524"
# connection_string = f"postgresql://postgres:{YOUR_POSTGRES_PASSWORD}@localhost/postgres"
connection_string = f"postgresql://postgres:{YOUR_POSTGRES_PASSWORD}@localhost:5432"
engine = sqlalchemy.create_engine(
    connection_string,
    future=True
)

# ? `db` - the database (connection) object will be used for executing queries on the connected database named `postgres` in our deployed Postgres DBMS
db = engine.connect()

# ? A dictionary containing
data_types = {
    'boolean': 'BOOL',
    'integer': 'INT',
    'text': 'TEXT',
    'time': 'TIME',
}

# ? @app.get is called a decorator, from the Flask class, converting a simple python function to a REST API endpoint (function)
# TODO: create a dictionary of tables
table_name_list = {
    "provider": {
        "provider_id": "INT",
        "first_name": "TEXT",
        "last_name": "TEXT",
        "email": "TEXT",
        "age": "INT",
        "nationality": "TEXT",
        "salary": "INT",
        "sex": "TEXT",
        "ethnicity": "TEXT"
    },
    "provider_password":{
        "provider_id": "INT",
        "password": "TEXT"
    },
    "housing": {
        "housing_id": "INT",
        "provider_id": "INT",
        "size": "INT",
        "type_of_housing": "TEXT",
        "location":"TEXT",
        "age_of_housing":"INT",
        "start_time": "Date",
        "end_time": "Date",
        "min_price": "FLOAT",
        "bidding_period": "INT",
        "rented": "TEXT",
        "description": "TEXT"
    },
    "housing_size_type": {
        "size": "INT",
        "size_type": "TEXT"
    },
    "housing_maxprice": {
        "size": "INT",
        "type_of_housing": "TEXT",
        "location": "TEXT",
        "age_of_housing": "INT",
        "max_price": "INT"
    },
    "renter": {
        "renter_id": "INT",
        "first_name": "TEXT",
        "last_name": "TEXT",
        "email": "TEXT",
        "age": "INT",
        "nationality": "TEXT",
        "salary": "INT",
        "sex": "TEXT",
        "ethnicity": "TEXT"
    },
    "renter_password":{
        "renter_id": "INT",
        "password": "TEXT"
    },
    "bids": {
        "housing_id": "INT",
        "renter_id": "INT",
        "start_time": "DATE",
        "end_time": "DATE",
        "price": "FLOAT",
        "bid_date": "DATE"
    }
}

@app.route("/hello", methods=["GET"])
def hello():
    return "Hello World"

@app.route("/sign-in", methods=["POST"])
def getname():
    param = request.json
    first_name = param['firstName']
    last_name = param['lastName']
    email = param['email']
    age = param['age']
    nationality = param['nationality']
    password = param['password']
    sex = param['sex']
    salary = param['salary']
    user_type = param['type']
    if user_type == "Provider":
        att_list = ['provider_id','first_name','last_name','email','age','nationality','salary','sex','ethnicity']
        type_list = ['INT','TEXT','TEXT','TEXT','INT','TEXT','INT','TEXT','TEXT']
        ethnicity = nationality
        statement = "SELECT max(provider_id) FROM provider;"
        res = db.execute(sqlalchemy.text(statement))
        res = generate_table_return_resulte_no_rename(res)
        new_user_id = res["rows"][0]['max']+1
        value_list = [new_user_id, first_name, last_name, email, age, nationality, salary, sex, ethnicity]
        insertion = {}
        insertion['name'] = 'provider'
        insertion['body'] = {}
        insertion["valueTypes"] = {}
        for att, v in zip(att_list, value_list):
            insertion['body'][att] = v
        for att, t in zip(att_list, type_list):
            insertion['valueTypes'][att] = t
        state = generate_insert_table_statement(insertion)
        db.execute(state)
        db.commit()
        
        statement = f"INSERT INTO provider_password VALUES ({new_user_id},'{password}');"
        db.execute(sqlalchemy.text(statement))
        db.commit()
    else:
        att_list = ['renter_id','first_name','last_name','email','age','nationality','salary','sex','ethnicity']
        type_list = ['INT','TEXT','TEXT','TEXT','INT','TEXT','INT','TEXT','TEXT']
        ethnicity = nationality
        statement = "SELECT max(renter_id) FROM renter;"
        res = db.execute(sqlalchemy.text(statement))
        res = generate_table_return_resulte_no_rename(res)
        new_user_id = res["rows"][0]['max']+1
        value_list = [new_user_id, first_name, last_name, email, age, nationality, salary, sex, ethnicity]
        insertion = {}
        insertion['name'] = 'Renter'
        insertion['body'] = {}
        insertion["valueTypes"] = {}
        for att, v in zip(att_list, value_list):
            insertion['body'][att] = v
        for att, t in zip(att_list, type_list):
            insertion['valueTypes'][att] = t
        state = generate_insert_table_statement(insertion)
        db.execute(state)
        db.commit()
        
        statement = f"INSERT INTO renter_password VALUES ({new_user_id},'{password}');"
        db.execute(sqlalchemy.text(statement))
        db.commit()
    return jsonify({"status": True, "details": ""})

  
@app.route("/log-in", methods=["POST"])
def log_in():
    param:Dict = request.json
    email = param['email']
    password = param['password']
    user_type = param['userType']
    response= {}

    if user_type == 'provider':
        statement = f"SELECT * FROM provider, provider_password WHERE provider.provider_id = provider_password.provider_id AND provider.email = '{email}' AND \
            provider_password.password = '{password}'"
        res = db.execute(sqlalchemy.text(statement))
        res = generate_table_return_resulte_no_rename(res)
        if len(res["rows"]) == 0:
            response['status'] = False
            response['token'] = ""
            response['userType'] = ""
            response['details'] = "No user found"
            return jsonify(response)
        else:
            response['status'] = True
            response['token'] = res["rows"][0]['provider_id']
            response['userType'] = 'provider'
            response['details'] = ''
            return jsonify(response)
    if user_type == 'renter':
        statement = f"SELECT * FROM renter, renter_password WHERE renter.renter_id = renter_password.renter_id AND renter.email = '{email}' AND \
            renter_password.password = '{password}'"
        res = db.execute(sqlalchemy.text(statement))
        res = generate_table_return_resulte_no_rename(res)
        if len(res["rows"]) == 0:
            response['status'] = False
            response['token'] = ""
            response['userType'] = ""
            response['details'] = "No user found"
            return jsonify(response)
        else:
            response['status'] = True
            response['token'] = res["rows"][0]['renter_id']
            response['userType'] = 'renter'
            response['details'] = ''
            return jsonify(response)

'''
def generate_conditional_select_statement(selection: Dict):
    statement = "SELECT"
    for att in selection["att"]:
        statement += f" {att},"
    statement = statement[:-1] + f" FROM {selection['table']}"
    statement += " WHERE"
    for att, val in selection["condition"].items():
        if type(val) is str:
            statement += f" {att}=\'{val}\' AND"
        else:
            statement += f" {att}={val} AND"
    print(statement[:-4])
    return sqlalchemy.text(statement[:-4])
'''

@app.route("/filter-for-houses", methods = ["POST"])
def filter():
    try:
        param = request.json
        input_dict = param["houseinfo"]
        response = {}
        type_string = "("
        for types in input_dict["type"]:
            type_string += f"'{types}',"
        type_string = type_string[:-1]
        type_string += ")"

        selection = {}
        selection["att"] = ["h.housing_id", "p.first_name", "p.last_name", "h.location", "h.min_price", "h.size", "hst.size_type", "h.start_time", "h.end_time",\
        "h.description", "h.type_of_housing"]
        selection["table"] = "housing h, provider p, housing_size_type hst"
        selection["condition"] = {}

        for key,value in input_dict.items():
            if key == "location":
                if value:
                    selection["condition"]["h.location"] = f"{value}"
            if key == "type":
                if value:
                    list_value = ''
                    for house_type in value:
                        list_value += f"{house_type} OR "
                    list_value = list_value[:-4]
                    selection["condition"]["h.type_of_housing"] = list_value
            if key == "size":
                if value:
                    selection["condition"]["h.size"] = value
        
        statement = generate_conditional_select_statement(selection)

        for key,value in input_dict.items():
            if key == "startDate":
                if value:
                    statement += f" AND h.start_time <= '{value}'"
            if key == "endDate":
                if value:
                    statement += f" AND h.end_time >= '{value}'"
        statement += " AND h.provider_id = p.provider_id AND h.size = hst.size"
        statement += ";"
        print(statement)

        res_rough_selection = db.execute(sqlalchemy.text(statement))
        db.commit()
        res_rough_selection = generate_table_return_resulte_no_rename(res_rough_selection, "bug here")
        print(res_rough_selection)

        housing_id_list = []
        housing_max_bid_list = []
        for housing_id_dict in res_rough_selection["rows"]:
            housing_id_list.append(housing_id_dict["housing_id"])
        print('housing_id_list len: ', len(housing_id_list))
        for housing_id in housing_id_list:
            statement = f"SELECT max(b.price) FROM bids b WHERE b.housing_id = {housing_id}"
            res = db.execute(sqlalchemy.text(statement))
            res = generate_table_return_resulte_no_rename(res)
            if res["rows"]:
                housing_max_bid_list.append(res["rows"][0]["max"])
            else:
                housing_max_bid_list.append(0)
        
        res_with_max_bid = res_rough_selection
        res_with_max_bid["columns"].append("current_bid")

        for index, bid_price in enumerate(housing_max_bid_list):
            res_with_max_bid["rows"][index]["current_bid"] = bid_price

        final_res = {}
        final_res["columns"] = res_with_max_bid["columns"]
        final_res["rows"] = []

        for index_selected_house in range(0,len(res_with_max_bid["rows"])):
            if res_with_max_bid["rows"][index_selected_house]["current_bid"] <= input_dict["maxPrice"]:
                final_res["rows"].append(res_with_max_bid["rows"][index_selected_house])

        response["houseInfoList"] = []
        for house_dict in final_res["rows"]:
            response_dict = {}
            response_dict["houseid"] = house_dict['housing_id']
            response_dict["providerName"] = f"{house_dict['first_name']}" + " " + f"{house_dict['last_name']}"
            response_dict["location"] = f"{house_dict['location']}"
            response_dict["minPrice"] = house_dict['min_price']
            response_dict["size"] = house_dict['size']
            response_dict["sizeType"] = f"{house_dict['size_type']}"
            response_dict["startDate"] = f"{house_dict['start_time']}"
            response_dict["endDate"] = f"{house_dict['end_time']}"
            response_dict["currentBid"] = house_dict['current_bid']
            response_dict["description"] = f"{house_dict['description']}"
            response_dict["type"] = f"{house_dict['type_of_housing']}"
            response_dict["images"] = []
            response["houseInfoList"].append(response_dict)
        response["status"] = True
        response["details"] = ""
    except:
        response["status"] = False
        response["houseInfoList"] = []
        response["details"] = "Filter failed"

    return jsonify(response)




@app.route("/admin/table-name", methods=["GET"])
def return_table():
    global table_name_list
    response = {}
    response['status'] = True
    # fill names of tables into a list
    return_table_name_list = []
    for keys in table_name_list:
        return_table_name_list.append(keys)
    
    response['tableNameList'] = return_table_name_list
    response['details'] = ''
    return jsonify(response)

@app.route("/admin/attributes", methods=["POST"])
def return_table_detail():
    needed_table_name_list = request.json
    response = {}
    response['status'] = True
    response['tableAttributes'] = []
    # append table names as keys into the dictionary as value of the key 'tableAttributes'
    for table_name in needed_table_name_list['tableNameList']:
        response['tableAttributes'].append({'name': table_name, 'attribute': []})
        # append attribute names as keys into the dictionary as value of the key table_name
        for attribute_name in table_name_list[table_name]:
            response['tableAttributes'][-1]['attribute'].append({"attributeName": attribute_name})
            response['tableAttributes'][-1]['attribute'][-1]["type"] = table_name_list[table_name][attribute_name]
            response['tableAttributes'][-1]['attribute'][-1]["count"] = []

            selection = {}
            selection['att'] = attribute_name
            selection['table'] = table_name
            if table_name_list[table_name][attribute_name] not in ["INT","FLOAT"]:
                statement = generate_group_by_statement(selection)
                res = db.execute(statement)
                db.commit()
                returned_result_in_dict = generate_table_return_resulte_no_rename(res)
                for dict in returned_result_in_dict['rows']:
                    for key1 in dict:
                        if key1 != 'count':
                            response['tableAttributes'][-1]['attribute'][-1]['count'].append({f"{dict[key1]}":0})
                            for key2 in dict:
                                if key2 == 'count':
                                    response['tableAttributes'][-1]['attribute'][-1]['count'][-1][f"{dict[key1]}"] = dict[key2]
                                    break
                        break
            else:
                statement = generate_max_min_statement(selection)
                res = db.execute(statement)
                db.commit()
                returned_result_in_dict = generate_table_return_resulte_no_rename(res)
                for key, value in returned_result_in_dict['rows'][0].items():
                    if key == 'min':
                        response['tableAttributes'][-1]['attribute'][-1]['count'].append({'minValue':value})
                    else:
                        response['tableAttributes'][-1]['attribute'][-1]['count'].append({'maxValue':value})
            
    response['detail'] = ''
    return response




@app.route("/provide-house", methods = ["POST"])
def provide_house():
    param = request.json
    # parse 
    # TODO: 对照和文档一不一样
    location = param['houseInfo']['location']
    size = param['houseInfo']['size']
    start_time = param['houseInfo']['startDate']
    end_time = param['houseInfo']['endDate']
    description = param['houseInfo']['description']
    type_of_house = param['houseInfo']['typeOfHouse']
    age = param['houseInfo']['age']
    min_price = param['houseInfo']['minPrice']
    bid_period = param['houseInfo']['bidPeriod']
    token = param['token']

    # calculate attributes
    statement = "SELECT max(housing_id) as max_houing_id from housing;"
    res = generate_table_return_resulte_rename(db.execute(sqlalchemy.text(statement)))
    db.commit()
    if len(res['rows']):
        houseID = 0
    else:
        houseID = res['rows'][0]['max_houing_id'] + 1
    providerID = token

    if size < 60:
         size_type = 'small', 
    elif 60 <= size and size < 100 :
        size_type = 'medium'
    else:
        size_type = 'large'   
    rented = 'no'

    
    # insertion
    insertion = {}
    insertion['name'] = 'housing'
    insertion['body'] = {}
    insertion['body']['housing_id'] = houseID
    insertion['body']['provider_id'] = providerID
    insertion['body']['size'] = size
    insertion['body']['type_of_housing'] = type_of_house
    insertion['body']['location'] = location
    
    insertion['body']['age_of_housing'] = age
    insertion['body']['start_time'] = start_time
    insertion['body']['end_time'] = end_time
    insertion['body']['min_price'] = min_price
    insertion['body']['bidding_period'] = bid_period
    insertion['body']['rented'] = rented
    insertion['body']['description'] = description
    
    insertion['valueTypes'] = {}
    insertion['valueTypes']['housing_id'] = "INT"
    insertion['valueTypes']['provider_id'] = "INT"
    insertion['valueTypes']['size'] = "INT"
    insertion['valueTypes']['type_of_housing'] = "TEXT"
    insertion['valueTypes']['location'] = "TEXT"
    insertion['valueTypes']['age_of_housing'] = "INT"
    insertion['valueTypes']['start_time'] = "DATE"
    insertion['valueTypes']['end_time'] = "DATE"
    insertion['valueTypes']['min_price'] = "FLOAT"
    insertion['valueTypes']['bidding_period'] = "INT"
    insertion['valueTypes']['rented'] = "TEXT"
    insertion['valueTypes']['description'] = "TEXT"

    type_insertion = {}
    type_insertion['body'] = {}
    type_insertion['valueTypes'] = {}
    type_insertion['name'] = 'housing_size_type'
    type_insertion['body']['size_type'] = size_type
    type_insertion['body']['size'] = size
    type_insertion['valueTypes']['size_type'] = "TEXT"
    type_insertion['valueTypes']['size'] = "INT"

    max_price = size * 5
    if type_of_house == 'HDB':
        max_price += 100
    elif type_of_house == 'condo':
        max_price += 200
    else:
        max_price += 300
    if location == 'Clementi':
        max_price += 100
    elif location == 'Commonwealth':
        max_price += 200
    elif location == 'Orchard':
        max_price += 300
    else:
        max_price += 400
    max_price_insertion = {}
    max_price_insertion['name'] = 'housing_maxprice'
    max_price_insertion['body'] = {}
    max_price_insertion['valueTypes'] = {}
    max_price_insertion['body']['size'] = size
    max_price_insertion['body']['type_of_housing'] = type_of_house
    max_price_insertion['body']['location'] = location
    max_price_insertion['body']['age_of_housing'] = age
    max_price_insertion['body']['max_price'] = max_price
    max_price_insertion['valueTypes']['size'] = 'INT'
    max_price_insertion['valueTypes']['type_of_housing'] = 'TEXT'
    max_price_insertion['valueTypes']['location'] = 'TEXT'
    max_price_insertion['valueTypes']['age_of_housing'] = 'INT'
    max_price_insertion['valueTypes']['max_price'] = 'INT'
    max_price_insert_statement = generate_insert_table_statement(max_price_insertion)
    type_insert = generate_insert_table_statement(type_insertion)
    statement = generate_insert_table_statement(insertion)

    # return response
    try:
        db.execute(max_price_insert_statement)
        db.execute(type_insert)
        db.execute(statement)
        db.commit()
        return jsonify({'status': True, 'details': ''})
    except Exception as e:
        db.rollback()
        return jsonify({'status': False, 'details': 'database insertion failed'})


@app.route("/house-list", methods = ['GET'])
def house_list():
    response = {}
    # get all house info
    statement = "SELECT housing_id, provider_id, location, min_price, size, start_time, end_time, type_of_housing, description FROM housing;"
    statement = sqlalchemy.text(statement)
    res = db.execute(statement)
    db.commit()
    res = generate_table_return_resulte_no_rename(res)
    response['houseInfoList'] = []
    try:
        for house in res['rows']:
            house_info = {}
            house_info['houseid'] = house['housing_id']
            print(type(house['housing_id']))
            house_info['location'] = house['location']
            house_info['minPrice'] = house['min_price']
            house_info['size'] = house['size']
            house_info['startDate'] = house['start_time']
            house_info['endDate'] = house['end_time']
            house_info['description'] = house['description']
            house_info['houseType'] = house['type_of_housing']
            provider_id = house['provider_id']
            # select provider name
            provider_name_selection = f"SELECT first_name, last_name FROM provider WHERE provider_id = '{provider_id}';"
            provider_name_selection = sqlalchemy.text(provider_name_selection)
            provider_res = db.execute(provider_name_selection)
            db.commit()
            provider_res = generate_table_return_resulte_no_rename(provider_res)
            house_info['providerName'] = provider_res['rows'][0]['first_name'] + provider_res['rows'][0]['last_name']
            # select size type
            size = house['size']
            size_type_selection = f"SELECT size_type FROM housing_size_type WHERE size = {size};"
            size_type_selection = sqlalchemy.text(size_type_selection)
            size_type_res = db.execute(size_type_selection)
            db.commit()
            size_type_res = generate_table_return_resulte_no_rename(size_type_res)
            house_info['sizeType'] = size_type_res['rows'][0]['size_type']
            # select current bid, which is the max value
            current_bid_selection = f"SELECT max(price) FROM bids WHERE housing_id = '{house['housing_id']}';"
            current_bid_selection = sqlalchemy.text(current_bid_selection)
            current_bid_res = db.execute(current_bid_selection)
            db.commit()
            current_bid_res = generate_table_return_resulte_rename(current_bid_res)
            house_info['currentBid'] = current_bid_res['rows'][0]['max']
            print(type(house_info['currentBid']))
            response['houseInfoList'].append(house_info)
        response['status'] = True
        response['details'] = ''
    except:
        response['status'] = False
        response['details'] = 'get list info error'
    return jsonify(response)


@app.route("/provider-info", methods=['POST'])
def provider_info():
    param = request.json
    house_id = param['houseID']
    response = {}
    try:
        statement = f'SELECT provider.email as email, provider.provider_id as id FROM provider, housing WHERE \
            provider.provider_id = housing.provider_id AND housing.housing_id = {house_id};'
        res =generate_table_return_resulte_no_rename(db.execute(sqlalchemy.text(statement)))
        response['status'] = True
        response['details'] = ""
        response['providerID'] = res['rows'][0]['id']
        response['providerEmail'] = res['rows'][0]['email']
    except:
        response['status'] = False
        response['details'] = 'Get user info failed'
    return response


@app.route("/make-bid", methods = ['POST'])
def make_bid():
    param = request.json
    #parse
    house_id = param['houseid']
    bid = param['bid']
    token = param['token']
    # insert into bids
    insert_dict = {}
    insert_dict['name'] = 'bids'
    insert_dict['body'] = {}
    insert_dict['valueTypes'] = {}
    insert_dict['body']['housing_id'] = house_id
    insert_dict['body']['renter_id'] = token
    insert_dict['body']['price'] = bid
    insert_dict['body']['start_time'] = param['startDate']
    insert_dict['body']['end_time'] = param['endDate']
    insert_dict['body']['bid_date'] = param['bidDate']
    insert_dict['valueTypes']['housing_id'] = 'INT'
    insert_dict['valueTypes']['renter_id'] = 'INT'
    insert_dict['valueTypes']['price'] = 'FLOAT'
    insert_dict['valueTypes']['start_time'] = 'DATE'
    insert_dict['valueTypes']['end_time'] = 'DATE'
    insert_dict['valueTypes']['bid_date'] = 'DATE'
    try:
        statement = generate_insert_table_statement(insert_dict)
        db.execute(statement)
        db.commit()
        return jsonify({'status': True, 'details': ""})
    except:
        return jsonify({'status': False, 'details': "Unable to make bid"})
    

@app.route("/admin/complex-query", methods=["POST"])
def complex_query():
    response = {}
    param = request.json
    tables = param["fromTable"]
    join_on = param["joinOn"]
    filter_equal = param["filterEqual"]
    filter_less = param["filterLess"]

    statement = "SELECT "
    for table_name in tables:
        att_list = table_name_list[table_name]
        for att_name in att_list:
            statement += f'{table_name}.{att_name} AS {table_name}__{att_name}, '
    statement = statement[:-2]
    statement += ' FROM '
    for table in tables:
        statement += f"{table}, "
    statement = statement[:-2]
    where_statement = False
    if join_on:
        statement += " WHERE "
        where_statement = True
        for join_on_condition in join_on:
            for key,value in join_on_condition.items():
                statement += f"{key}.{value}="
            statement = statement[:-1] + " AND "
        statement = statement[:-5]
    
    if filter_equal:
        if not where_statement:
            statement += " WHERE "
            where_statement = True
        else:
            statement += " AND "

        for table_name, table_attribute_list in filter_equal.items():
            item_list = map(lambda x: (list(x.keys())[0], list(x.values())[0]),table_attribute_list)
            sorted_list = sorted(item_list, key = lambda x: x[0])
            for index in range(len(sorted_list)):
                if index == 0:
                    if type(sorted_list[index][1]) == int or type(sorted_list[index][1]) == float:
                        statement += f"({table_name}.{sorted_list[index][0]} = {sorted_list[index][1]} "
                    else:
                        statement += f"({table_name}.{sorted_list[index][0]} = '{sorted_list[index][1]}' "
                else:
                    if sorted_list[index][0] == sorted_list[index-1][0]:
                        if type(sorted_list[index][1]) == int or type(sorted_list[index][1]) == float:
                            statement += f" OR {table_name}.{sorted_list[index][0]} = {sorted_list[index][1]} "
                        else:
                            statement += f" OR {table_name}.{sorted_list[index][0]} = '{sorted_list[index][1]}' "
                    else:
                        if type(sorted_list[index][1]) == int or type(sorted_list[index][1]) == float:
                            statement += f") AND ({table_name}.{sorted_list[index][0]} = {sorted_list[index][1]} "
                        else:
                            statement += f") AND ({table_name}.{sorted_list[index][0]} = '{sorted_list[index][1]}' "
            statement += ") AND "
        statement = statement[:-5] 

    if filter_less:
        if not where_statement:
            statement += " WHERE "
            where_statement = True
        else:
            statement += " AND "
        for table_name, table_attribute_list in filter_less.items():
            for attribute,value in table_attribute_list.items():
                statement += f"{table_name}.{attribute} < {value} AND "
        statement = statement[:-5]
    statement += ";"
    print(statement)
    statement = sqlalchemy.text(statement)
    # try:
    res = db.execute(statement)
    db.commit()
    res = generate_table_return_resulte_rename(res)
    print(res)
    response["status"] = True
    response["tableData"] = res
    response["details"] = ""
    # except:
    #     db.rollback()
    #     response["status"] = False
    #     response["tableData"] = {}
    #     response["details"] = "Database selection failed"
    return jsonify(response)

@app.route("/admin/delete", methods= ["POST"])
def delete():
    param = request.json
    response = {}
    attribute_dict = param["entryInfo"]
    target_attribute_dict = {}
    table_name = ''
    for key,value in attribute_dict.items():
        parts = key.split("__")
        part1 = parts[0]
        table_name = part1
        part2 = key[len(part1)+2:]
        target_attribute_dict[part2] = value

    statement = f"DELETE FROM {table_name} WHERE "
    for attribute, value in target_attribute_dict.items():
        if table_name_list[table_name][attribute] in ["INT","FLOAT"]:
            statement += (f"{table_name}.{attribute} = {value} AND ")
        else:
            statement += (f"{table_name}.{attribute} = '{value}' AND ")
    statement = statement[:-5] + ";"
    statement = sqlalchemy.text(statement)
    try:
        db.execute(statement)
        db.commit()
        response["status"] = True
        response["details"] = ""
    except:
        db.rollback()
        response["status"] = False
        response["details"] = "Database deletion failed"
    return jsonify(response)

@app.route("/admin/update",methods = ["POST"])
def update():
    param = request.json
    response = {}
    original_attribute_dict = param["orgRow"]
    new_attribute_dict = param["newRow"]
    change_attribute_dict = {}
    update_attribute_dict = {}
    table_name = ''

    for key,value in original_attribute_dict.items():
        parts = key.split("__")
        part1 = parts[0]
        table_name = part1
        part2 = key[len(part1)+2:]
        change_attribute_dict[part2] = value
    
    for key,value in new_attribute_dict.items():
        parts = key.split("__")
        part1 = parts[0]
        part2 = key[len(part1)+2:]
        update_attribute_dict[part2] = value
    
    statement = f"UPDATE {table_name} SET "
    for attribute, value in update_attribute_dict.items():
        if table_name_list[table_name][attribute] in ["INT","FLOAT"]:
            statement += (f"{attribute} = {value},")
        else:
            statement += (f"{attribute} = '{value}',")

    statement = statement[:-1] + " WHERE "

    for attribute, value in change_attribute_dict.items():
        if table_name_list[table_name][attribute] in ["INT","FLOAT"]:
            statement += (f"{table_name}.{attribute} = {value} AND ")
        else:
            statement += (f"{table_name}.{attribute} = '{value}' AND ")

    statement = statement[:-5] + ";"
    statement = sqlalchemy.text(statement)
    print(statement)
    try:
        db.execute(statement)
        db.commit()
        response["status"] = True
        response["details"] = ""
    except:
        db.rollback()
        response["status"] = False
        response["details"] = "Database update failed"
    return jsonify(response)

@app.route("/admin/add",methods = ["POST"])
def add():
    param = request.json
    response = {}
    attribute_dict = param["entryInfo"]
    target_attribute_dict = {}
    table_name = ''
    for key,value in attribute_dict.items():
        parts = key.split("__")
        part1 = parts[0]
        table_name = part1
        part2 = key[len(part1)+2:]
        target_attribute_dict[part2] = value

    statement = f"INSERT INTO {table_name} "
    attribute_name = "("
    attribute_values = "("
    for attribute, value in target_attribute_dict.items():
        attribute_name += f"{attribute},"
        if table_name_list[table_name][attribute] in ["INT","FLOAT"]:
            attribute_values += f"{value},"
        else:
            attribute_values += f"'{value}',"
    attribute_name = attribute_name[:-1] + ")"
    attribute_values = attribute_values[:-1] + ")"

    statement += f"{attribute_name} VALUES {attribute_values};"
    statement = sqlalchemy.text(statement)
    try:
        db.execute(statement)
        db.commit()
        response["status"] = True
        response["details"] = ""
    except:
        db.rollback()
        response["status"] = False
        response["details"] = "Database insertion failed"
    return jsonify(response)


@app.get("/table")
def get_relation():
    # ? This method returns the contents of a table whose name (table-name) is given in the url `http://localhost:port/table?name=table-name`
    # ? Below is the default way of parsing the arguments from http url's using flask's request object
    relation_name = request.args.get('name', default="", type=str)
    # ? We use try-except statements for exception handling since any wrong query will crash the whole flow
    try:
        # ? Statements are built using f-strings - Python's formatted strings
        # ! Use cursors for better results
        statement = sqlalchemy.text(f"SELECT * FROM {relation_name};")
        # ? Results returned by the DBMS after execution are stored into res object defined in sqlalchemy (for reference)
        res = db.execute(statement)
        # ? committing the statement writes the db state to the disk; note that we use the concept of rollbacks for safe DB management
        db.commit()
        # ? Data is extracted from the res objects by the custom function for each query case
        # ! Note that you'll have to write custom handling methods for your custom queries
        data = generate_table_return_resulte_no_rename(res)
        # ? Response object is instantiated with the formatted data and returned with the success code 200
        return Response(data, 200)
    except Exception as e:
        # ? We're rolling back at any case of failure
        db.rollback()
        # ? At any error case, the error is returned with the code 403, meaning invalid request
        # * You may customize it for different exception types, in case you may want
        return Response(str(e), 403)


# ? a flask decorator listening for POST requests at the url /table-create
@app.post("/table-create")
def create_table():
    # ? request.data returns the binary body of the POST request
    data = request.data.decode()
    try:
        # ? data is converted from stringified JSON to a Python dictionary
        table = json.loads(data)
        # ? data, or table, is an object containing keys to define column names and types of the table along with its name
        statement = generate_create_table_statement(table)
        # ? the remaining steps are the same
        db.execute(statement)
        db.commit()
        return Response(statement.text)
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)


@app.post("/table-insert")
# ? a flask decorator listening for POST requests at the url /table-insert and handles the entry insertion into the given table/relation
# * You might wonder why PUT or a similar request header was not used here. Fundamentally, they act as POST. So the code was kept simple here
def insert_into_table():
    # ? Steps are common in all of the POST behaviors. Refer to the statement generation for the explanatory
    data = request.data.decode()
    try:
        insertion = json.loads(data)
        statement = generate_insert_table_statement(insertion)
        db.execute(statement)
        db.commit()
        return Response(statement.text)
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)


@app.post("/table-update")
# ? a flask decorator listening for POST requests at the url /table-update and handles the entry updates in the given table/relation
def update_table():
    # ? Steps are common in all of the POST behaviors. Refer to the statement generation for the explanatory
    data = request.data.decode()
    try:
        update = json.loads(data)
        statement = generate_update_table_statement(update)
        db.execute(statement)
        db.commit()
        return Response(statement.text, 200)
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)


@app.post("/entry-delete")
# ? a flask decorator listening for POST requests at the url /entry-delete and handles the entry deletion in the given table/relation
def delete_row():
    # ? Steps are common in all of the POST behaviors. Refer to the statement generation for the explanatory
    data = request.data.decode()
    try:
        delete = json.loads(data)
        statement = generate_delete_statement(delete)
        db.execute(statement)
        db.commit()
        return Response(statement.text)
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)




def generate_table_return_resulte_no_rename(res, cmd='no bug') -> Dict:
    print('generate_table_return_resulte_no_rename calleds' + cmd)
    # ? An empty Python list to store the entries/rows/tuples of the relation/table
    rows = []

    # ? keys of the SELECT query result are the columns/fields of the table/relation
    columns = list(res.keys())

    # ? Constructing the list of tuples/rows, basically, restructuring the object format
    length = 0
    for row_number, row in enumerate(res):
        rows.append({})
        print(row_number)
        length += 1
        print(length)
        for column_number, value in enumerate(row):
            rows[row_number][columns[column_number]] = value

    # ? JSON object with the relation data
    output = {}
    output["columns"] = columns  # ? Stores the fields
    output["rows"] = rows  # ? Stores the tuples

    """
        The returned object format:
        {
            "columns": ["a","b","c"],
            "rows": [
                {"a":1,"b":2,"c":3},
                {"a":4,"b":5,"c":6}
            ]
        }
    """
    # ? Returns the Dict
    return output

def generate_table_return_resulte_rename(res) -> Dict:
    # ? An empty Python list to store the entries/rows/tuples of the relation/table
    rows = []

    # ? keys of the SELECT query result are the columns/fields of the table/relation
    columns = list(res.keys())
    column_output = []
    for col_name in columns:
        if col_name not in column_output:
            column_output.append(col_name)

    # ? Constructing the list of tuples/rows, basically, restructuring the object format
    for row_number, row in enumerate(res):
        rows.append({})
        for column_number, value in enumerate(row):
            if columns[column_number] not in rows[row_number].keys():
                rows[row_number][columns[column_number]] = value

    # ? JSON object with the relation data
    output = {}
    output["columns"] = column_output  # ? Stores the fields
    output["rows"] = rows  # ? Stores the tuples

    """
        The returned object format:
        {
            "column": ["a","b","c"],
            "rows": [
                {"a":1,"b":2,"c":3},
                {"a":4,"b":5,"c":6}
            ]
        }
    """
    # ? Returns the Dict
    return output


def generate_delete_statement(details: Dict):
    # ? Fetches the entry id for the table name
    table_name = details["relationName"]
    id = details["deletionId"]
    # ? Generates the deletion query for the given entry with the id
    statement = f"DELETE FROM {table_name} WHERE id={id};"
    return sqlalchemy.text(statement)


def generate_update_table_statement(update: Dict):

    # ? Fetching the table name, entry/tuple id and the update body
    table_name = update["name"]
    id = update["id"]
    body = update["body"]

    # ? Default for the SQL update statement
    statement = f"UPDATE {table_name} SET "
    # ? Constructing column-to-value maps looping
    for key, value in body.items():
        statement += f"{key}=\'{value}\',"

    # ?Finalizing the update statement with table and row details and returning
    statement = statement[:-1]+f" WHERE {table_name}.id={id};"
    return sqlalchemy.text(statement)


"""
SELECT att1, att2,... FROM table_name
param: selection: Dict
selection: {
    "table" : "table_name",
    "att":[
        "att1",
        "att2"
    ]
}
"""
def generate_simple_select_statement(selection: Dict):
    statement = "SELECT"
    for att in selection["att"]:
        statement += f" {att},"
    statement = statement[:-1] + f" FROM {selection['table']}"
    return sqlalchemy.text(statement)


"""
retern: SELECT att1, att2,... FROM table_name WHERE att3=value1 AND att4=value2,...
param: selection: Dict
selection: {
    "table" : "table_name",
    "att": [
        "att1",
        "att2"
    ]
    "condition":{
        "att3": value1
        "att4": value2
    }
}
"""
def generate_conditional_select_statement(selection: Dict):
    statement = "SELECT"
    for att in selection["att"]:
        statement += f" {att},"
    statement = statement[:-1] + f" FROM {selection['table']}"
    statement += " WHERE"
    for att, val in selection["condition"].items():
        if type(val) is str:
            statement += f" {att}=\'{val}\' AND"
        else:
            statement += f" {att}={val} AND"
    statement = statement [:-4]
    return statement

'''
statement = 'SELECT ...'
statement = sqlalchemy.text(statement)
res = db.execute(statement)
if res is not None:
    ...
'''


"""
SELECT att,COUNT(*)
FROM table_name
GROUP BY table_name.att;
"""
def generate_group_by_statement(selection: Dict):
    statement = 'SELECT '
    statement += f"{selection['att']}" + "," + "COUNT(*)"
    statement += f" FROM {selection['table']}"
    statement += f" GROUP BY {selection['table']}.{selection['att']};"
    return sqlalchemy.text(statement)

def generate_max_min_statement(selection: Dict):
    statement = 'SELECT'
    statement += f" MIN ({selection['att']}), MAX ({selection['att']})"
    statement += f" FROM {selection['table']}"
    return sqlalchemy.text(statement)


"""
INSERT INTO table_name VALUES(att1 type1, att2 type2, ...);
param: table: Dict
insertion: {
    "name": "table_name",
    "body": {
        "att1": "value1",
        "att2": "value2"
    }
    "valueTypes": {
        "att1": "type1",
        "att2": "type2"
    }
}
"""
def generate_insert_table_statement(insertion: Dict):
    # ? Fetching table name and the rows/tuples body object from the request
    table_name = insertion["name"]
    body = insertion["body"]
    valueTypes = insertion["valueTypes"]

    # ? Generating the default insert statement template
    statement = f"INSERT INTO {table_name}  "

    # ? Appending the entries with their corresponding columns
    column_names = "("
    column_values = "("
    for key, value in body.items():
        column_names += (key+",")
        if valueTypes[key] == "TEXT" or valueTypes[key] == "TIME" or valueTypes[key] == "DATE":
            column_values += (f"\'{value}\',")
        else:
            column_values += (f"{value},")

    # ? Removing the last default comma
    column_names = column_names[:-1]+")"
    column_values = column_values[:-1]+")"

    # ? Combining it all into one statement and returning
    #! You may try to expand it to multiple tuple insertion in another method
    statement = statement + column_names+" VALUES "+column_values+";"
    print(statement)
    return sqlalchemy.text(statement)


"""
CREATE TABLE table_name (v1 type1, v2 type2, ...);
param: table: Dict
table: {
    "name": "table_name"
    "body": {
        "v1": "type1",
        "v2": "type2"
    }
    "primary_key" : "vp"
}
"""
def generate_create_table_statement(table: Dict):
    # ? First key is the name of the table
    table_name = table["name"]
    # ? Table body itself is a JSON object mapping field/column names to their values
    table_body = table["body"]
    # ? reference table
    if "reference" in table.keys():
        table_reference = table["reference"]
    # ? Default table creation template query is extended below. Note that we drop the existing one each time. You might improve this behavior if you will
    # ! ID is the case of simplicity
    statement = f"DROP TABLE IF EXISTS {table_name}; CREATE TABLE {table_name} ("
    # ? As stated above, column names and types are appended to the creation query from the mapped JSON object
    for key, value in table_body.items():
        statement += (f"{key}"+" "+f"{value}"+ ",")
    # ? Add primary key
    statement += "PRIMARY KEY"+ " "+f"{table['primary_key']}"+ ","
    # ? Add references
    if "reference" in table.keys():
        for key,value in table_reference.items():
            statement += ("FOREIGN KEY"+ " " +f"{key}"+ " "+"REFERENCES"+ " "+f"{value}" + "ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED" + ",")
    # ? closing the final statement (by removing the last ',' and adding ');' termination and returning it
    statement = statement[:-1] + ");"
    print(statement)
    return sqlalchemy.text(statement)

# ? This method can be used by waitress-serve CLI 
def create_app():
   return app

def create_schema():
    # TODO: create schema
    table = {}
    table["name"] = "TestRegisterTable"
    table['body'] = {}
    table['body']["firstName"] = "TEXT"
    table['body']["lastName"] = "TEXT"
    table['body']["email"] = "TEXT"
    table['body']["age"] = "INT"
    table['body']["nationality"] = "TEXT"
    table['body']["password"] = "TEXT"
    table['body']["type"] = "TEXT"
    table['body']['token'] = "TEXT"
    table['primary_key'] = '(token)'
    state = generate_create_table_statement(table)
    db.execute(state)
    db.commit()


def fill_data():
    # fill fake data into database
    '''
    insertion = {}
    insertion['name'] = "TestRegisterTable"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ["firstName", "lastName", "email", "age", "nationality", "password", "type", 'token']
    type_list = ["TEXT", "TEXT", "TEXT", 'INT', "TEXT", "TEXT", "TEXT", "TEXT"]
    value_list = ["Jixuan", "He", "123@qq.com", 23, "China", "12345678", "provider", "a79c7bb223f90e"]
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()
    '''

    insertion = {}
    insertion['name'] = "provider"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ['provider_id','first_name','last_name','email','age','nationality','salary','sex','ethnicity']
    type_list = ['INT','TEXT','TEXT','TEXT','INT','TEXT','INT','TEXT','TEXT']
    value_list = [54321,'Junjie','Tian','123@qq.com',19,'Chinese',0,'Male','Chinese']
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()

    insertion = {}
    insertion['name'] = "provider"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ['provider_id','first_name','last_name','email','age','nationality','salary','sex','ethnicity']
    type_list = ['INT','TEXT','TEXT','TEXT','INT','TEXT','INT','TEXT','TEXT']
    value_list = [55555,'Junjie','Tian','123@outlook.com',19,'Chinese',0,'Male','Chinese']
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()

    insertion = {}
    insertion['name'] = "provider_password"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ['provider_id',"password"]
    type_list = ['INT','TEXT']
    value_list = [54321,"edcba"]
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()

    insertion = {}
    insertion['name'] = "provider_password"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ['provider_id',"password"]
    type_list = ['INT','TEXT']
    value_list = [55555,"eeeee"]
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()

    insertion = {}
    insertion['name'] = "housing_size_type"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ['size','size_type']
    type_list = ['INT','TEXT']
    value_list = [80,'middle']
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()

    insertion = {}
    insertion['name'] = "housing_maxprice"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ['size','type_of_housing','location','age_of_housing','max_price']
    type_list = ['INT','TEXT','TEXT','INT','INT']
    value_list = [80,'condo','Sentosa',3,10000]
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()

    insertion = {}
    insertion['name'] = "housing"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ['housing_id','provider_id','size','type_of_housing','location','age_of_housing','start_time','end_time','min_price','bidding_period','rented','description']
    type_list = ['INT','INT','INT','TEXT','TEXT','INT','DATE','DATE','FLOAT','INT','TEXT','TEXT']
    value_list = [12345,54321,80,'condo','Sentosa',3,'2022-09-01','2023-09-01',1000,100,'no','good house near sea']
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()

    insertion = {}
    insertion['name'] = "renter"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ['renter_id','first_name','last_name','email','age','nationality','salary','sex','ethnicity']
    type_list = ['INT','TEXT','TEXT','TEXT','INT','TEXT','INT','TEXT','TEXT']
    value_list = [88888,'Junjie','Tian','123@qq.com',19,'Chinese',0,'Male','Chinese']
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()

    insertion = {}
    insertion['name'] = "renter_password"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ['renter_id',"password"]
    type_list = ['INT','TEXT']
    value_list = [88888,"fffff"]
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()

    insertion = {}
    insertion['name'] = "bids"
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    att_list = ['housing_id','renter_id','start_time','end_time','price','bid_date']
    type_list = ['INT','INT','DATE','DATE','FLOAT','DATE']
    value_list = [12345,88888,'2023-04-01','2023-05-01',8000,'2023-03-25']
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    state = generate_insert_table_statement(insertion)
    db.execute(state)
    db.commit()

def delete_data():
    statement = sqlalchemy.text('DROP TABLE IF EXISTS bids;')
    db.execute(statement)
    db.commit()
    statement = sqlalchemy.text('DROP TABLE IF EXISTS renter_password;')
    db.execute(statement)
    db.commit()
    statement = sqlalchemy.text('DROP TABLE IF EXISTS renter;')
    db.execute(statement)
    db.commit()
    statement = sqlalchemy.text('DROP TABLE IF EXISTS housing;')
    db.execute(statement)
    db.commit()
    statement = sqlalchemy.text('DROP TABLE IF EXISTS housing_size_type;')
    db.execute(statement)
    db.commit()
    statement = sqlalchemy.text('DROP TABLE IF EXISTS housing_maxprice;')
    db.execute(statement)
    db.commit()
    statement = sqlalchemy.text('DROP TABLE IF EXISTS provider_password;')
    db.execute(statement)
    db.commit()
    statement = sqlalchemy.text('DROP TABLE IF EXISTS provider CASCADE;')
    db.execute(statement)
    db.commit()



# ? The port where the debuggable DB management API is served
PORT = 2223
#PORT = 2222
# ? Running the flask app on the localhost/0.0.0.0, port 2222
# ? Note that you may change the port, then update it in the view application too to make it work (don't if you don't have another application occupying it)
if __name__ == "__main__":
    # app.run("0.0.0.0", PORT)
    # create_schema()
    # fill_data()
    # statement = sqlalchemy.text("SELECT * FROM TestRegisterTable;")
    # res = db.execute(statement)
    # db.commit()
    # print(generate_table_return_resulte_no_rename(res))

    delete_data()


    table_provider = {
        "name": "provider",
        "body": {
            "provider_id": "INT NOT NULL",
            "first_name": "TEXT NOT NULL",
            "last_name": "TEXT NOT NULL",
            "email": "TEXT UNIQUE NOT NULL",
            "age": "INT NOT NULL CHECK(age>=18)",
            "nationality": "TEXT NOT NULL",
            "salary": "INT NOT NULL CHECK(salary>=0)",
            "sex": "TEXT NOT NULL",
            "ethnicity": "TEXT NOT NULL"},
        "primary_key": "(provider_id)"
    }
    table = generate_create_table_statement(table_provider)
    db.execute(table)
    db.commit()


    table_housing_size_type = {
        "name": "housing_size_type",
        "body": {
            "size": "INT NOT NULL CHECK (size>0 AND size<=1000)",
            "size_type": "TEXT NOT NULL CHECK(size_type IN ('large','middle','small') AND ((size_type = 'large' AND size>=100) OR (size_type = 'middle' AND (size>=60 AND size<100)) OR (size_type = 'small' AND (size<60))))"},
        "primary_key": "(size)",
        }
    table = generate_create_table_statement(table_housing_size_type)
    db.execute(table)
    db.commit()

    table_housing_maxprice = {
        "name": "housing_maxprice",
        "body": {
            "size": "INT NOT NULL CHECK (size>0 AND size<=1000)",
            "type_of_housing": "TEXT NOT NULL",
            "location": "TEXT NOT NULL",
            "age_of_housing": "INT NOT NULL CHECK(age_of_housing > 0)",
            "max_price": "INT NOT NULL CHECK(max_price > 0)"
        },
        "primary_key": "(size,type_of_housing,location,age_of_housing)"
        }
    table = generate_create_table_statement(table_housing_maxprice)
    db.execute(table)
    db.commit()

    table_housing = {
        "name": "housing",
        "body": {
            "housing_id": "INT NOT NULL",
            "provider_id": "INT NOT NULL",
            "size": "INT NOT NULL CHECK (size>0 AND size<=1000)",
            "type_of_housing": "TEXT NOT NULL",
            "location":"TEXT NOT NULL",
            "age_of_housing":"INT NOT NULL CHECK (age_of_housing>0)",
            "start_time": "Date NOT NULL",
            "end_time": "Date NOT NULL CHECK (end_time > start_time)",
            "min_price": "FLOAT NOT NULL CHECK (min_price > 0)",
            "bidding_period": "INT NOT NULL CHECK (bidding_period > 0)",
            "rented": "TEXT NOT NULL CHECK (rented IN ('yes', 'no'))",
            "description": "TEXT NOT NULL"},
        "primary_key": "(housing_id)",
        "reference": {
            "(size)": "housing_size_type(size)",
            "(size,type_of_housing,location,age_of_housing)": "housing_maxprice(size,type_of_housing,location,age_of_housing)",
            "(provider_id)": "provider(provider_id)"}}
    table = generate_create_table_statement(table_housing)
    db.execute(table)
    db.commit()

    table_renter = {
        "name": "renter",
        "body": {
            "renter_id": "INT NOT NULL",
            "first_name": "TEXT NOT NULL",
            "last_name": "TEXT NOT NULL",
            "email": "TEXT NOT NULL",
            "age": "INT NOT NULL CHECK (age>=18)",
            "nationality": "TEXT NOT NULL",
            "salary": "INT NOT NULL CHECK (salary>=0)",
            "sex": "TEXT NOT NULL",
            "ethnicity": "TEXT NOT NULL"
        },
        "primary_key": "(renter_id)"
    }
    table = generate_create_table_statement(table_renter)
    db.execute(table)
    db.commit()


    table_bids = {
        "name": "bids",
        "body": {
            "housing_id": "INT NOT NULL",
            "renter_id": "INT NOT NULL",
            "start_time": "DATE NOT NULL",
            "end_time": "DATE NOT NULL CHECK (end_time >= start_time)",
            "price": "FLOAT NOT NULL CHECK (price > 0)",
            "bid_date": "DATE NOT NULL"
        },
        "primary_key": "(housing_id,renter_id)",
        "reference": {
            "(housing_id)": "housing(housing_id)",
            "(renter_id)": "renter(renter_id)"
        }
    }
    table = generate_create_table_statement(table_bids)
    db.execute(table)
    db.commit()

    table_provider_password = {
        "name": "provider_password",
        "body": {
            "provider_id": "INT NOT NULL",
            "password": "TEXT NOT NULL"
        },
        "primary_key": "(provider_id)",
        "reference": {"(provider_id)":"provider(provider_id)"}
    }
    table = generate_create_table_statement(table_provider_password)
    db.execute(table)
    db.commit()

    table_renter_password = {
        "name": "renter_password",
        "body": {
            "renter_id": "INT NOT NULL",
            "password": "TEXT NOT NULL"
        },
        "primary_key": "(renter_id)",
        "reference": {"(renter_id)":"renter(renter_id)"}
    }
    table = generate_create_table_statement(table_renter_password)
    db.execute(table)
    db.commit()

    fill_data()

    # server run
    app.run("127.0.0.1", PORT)
    # ? Uncomment the below lines and comment the above lines below `if __name__ == "__main__":` in order to run on the production server
    # ? Note that you may have to install waitress running `pip install waitress`
    # ? If you are willing to use waitress-serve command, please add `/home/sadm/.local/bin` to your ~/.bashrc
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=PORT)




