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
YOUR_POSTGRES_PASSWORD = "Jishuhou524"
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


@app.route("/hello", methods=["GET"])
def hello():
    return "Hello World"

@app.route("/sign-in", methods=["POST"])
def getname():
    param = request.json
    att_list = ["firstName", "lastName", "email", "age", "nationality", "password", "type", "token"]
    type_list = ["TEXT", "TEXT", "TEXT", 'INT', "TEXT", "TEXT", "TEXT", "TEXT"]
    value_list = [param[x] for x in att_list[:-1]]
    value_list.append(hashlib.md5((param['firstName']+param['lastName']+param['email']).encode()).hexdigest())    # calculate the token
    insertion = {}
    insertion['name'] = 'TestRegisterTable'
    insertion['body'] = {}
    insertion["valueTypes"] = {}
    for att, v in zip(att_list, value_list):
        insertion['body'][att] = v
    for att, t in zip(att_list, type_list):
        insertion['valueTypes'][att] = t
    print(insertion)
    try:
        state = generate_insert_table_statement(insertion)
        db.execute(state)
        db.commit()
        return jsonify({"status":True, "details": ""})
    except Exception as e:
        db.rollback()
        return jsonify({"status":False, "token": "", "details": "insertion error"})
    
@app.route("/log-in", methods=["POST"])
def log_in():
    param = request.json
    att_list = ["token"]
    selection = {"table": "TestRegisterTable", "att": att_list, "condition": param}
    statement = generate_conditional_select_statement(selection)
    res = db.execute(statement)
    db.commit()
    response = {}
    res = generate_table_return_result(res)
    if len(res["rows"]) == 0:
        response['status'] = False
        response['token'] = ''
        response['details'] = 'Wrong User Name or Password'
    else:
        response['status'] = True
        response['token'] = res["rows"][0]['token']
        response['details'] = ''
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
        data = generate_table_return_result(res)
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


def generate_table_return_result(res) -> Dict:
    # ? An empty Python list to store the entries/rows/tuples of the relation/table
    rows = []

    # ? keys of the SELECT query result are the columns/fields of the table/relation
    columns = list(res.keys())

    # ? Constructing the list of tuples/rows, basically, restructuring the object format
    for row_number, row in enumerate(res):
        rows.append({})
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
SELECT att1, att2,... FROM table_name WHERE att3=value1 AND att4=value2,...
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
    print(statement[:-4])
    return sqlalchemy.text(statement[:-4])


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
        if valueTypes[key] == "TEXT" or valueTypes[key] == "TIME":
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
        statement += (f"{key}"+" "+f"{value}")
    # ? Add primary key
    statement += (f"table[primary_key]"+ " "+"PRIMARY KEY NOT NULL")
    # ? Add references
    if "reference" in table.keys():
        for key,value in table_reference.items():
            statement += ("FOREIGN KEY"+ " " +f"{key}"+ " "+"REFERENCES"+ f"{value}")
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
    table['primary_key'] = 'token'
    state = generate_create_table_statement(table)
    db.execute(state)
    db.commit()

def fill_data():
    # fill fake data into database
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

# ? The port where the debuggable DB management API is served
PORT = 2222
# ? Running the flask app on the localhost/0.0.0.0, port 2222
# ? Note that you may change the port, then update it in the view application too to make it work (don't if you don't have another application occupying it)
if __name__ == "__main__":
    # app.run("0.0.0.0", PORT)
    create_schema()
    fill_data()
    statement = sqlalchemy.text("SELECT * FROM TestRegisterTable;")
    res = db.execute(statement)
    db.commit()
    print(generate_table_return_result(res))

    table_provider = {
        "name": "provider",
        "body": {
            "provider_id": "NUMERIC",
            "first_name": "TEXT",
            "last_name": "TEXT",
            "email": "TEXT",
            "age": "NUMERIC",
            "nationality": "TEXT",
            "salary": "NUMERIC",
            "sex": "TEXT",
            "ethnicity": "TEXT"},
        "primary_key": "provider_id"
    }
    table = generate_create_table_statement(table_provider)
    db.execute(statement)
    db.commit()

    table_housing = {
        "name": "housing",
        "body": {
            "housing_id": "NUMERIC",
            "provider_id": "NUMERIC",
            "size": "NUMERIC",
            "type_of_housing": "TEXT",
            "location":"TEXT",
            "size_type": "TEXT",
            "age_of_housing":"NUMERIC",
            "start_time": "Date",
            "end_time": "Date",
            "min_price": "NUMERIC",
            "bidding_period": "NUMERIC",
            "rented": "TEXT"},
        "primary_key": "housing_id",
        "reference": {
            "provider_id": "provider(provider_id)"}}
    table = generate_create_table_statement(table_housing)
    db.execute(statement)
    db.commit()

    table_housing_maxprice = {
        "name": "housing",
        "body": {
            "size": "NUMERIC",
            "type_of_housing": "TEXT",
            "location": "TEXT",
            "age_of_housing": "NUMERIC",
            "max_price": "NUMERIC"
        },
        "primary_key": "(size,type_of_housing,location,age_of_housing)",
        "reference": {
            "size": "housing(size)",
            "type_of_housing": "housing(type_of_housing)",
            "location": "housing(location)",
            "age_of_housing": "housing(age_of_housing)"
        }
    }
    table = generate_create_table_statement(table_housing_maxprice)
    db.execute(statement)
    db.commit()

    table_renter = {
        "name": "renter",
        "body": {
            "renter_id": "NUMERIC",
            "first_name": "TEXT",
            "last_name": "TEXT",
            "email": "TEXT",
            "age": "NUMERIC",
            "nationality": "TEXT",
            "salary": "NUMERIC",
            "sex": "TEXT",
            "ethnicity": "TEXT"
        },
        "primary_key": "renter_id"
    }
    table = generate_create_table_statement(table_renter)
    db.execute(statement)
    db.commit()

    table_bids = {
        "name": "bids",
        "body": {
            "housing_id": "NUMERIC",
            "renter_id": "NUMERIC",
            "start_time": "DATE",
            "end_time": "DATE",
            "price": "NUMERIC",
            "bid_date": "DATE"
        },
        "primary_key": "(housing_id,renter_id)",
        "reference": {
            "housing_id": "housing(housing_id)",
            "renter_id": "renter(renter_id)"
        }
    }
    table = generate_create_table_statement(table_bids)
    db.execute(statement)
    db.commit()






    # server run
    app.run("127.0.0.1", PORT)
    # ? Uncomment the below lines and comment the above lines below `if __name__ == "__main__":` in order to run on the production server
    # ? Note that you may have to install waitress running `pip install waitress`
    # ? If you are willing to use waitress-serve command, please add `/home/sadm/.local/bin` to your ~/.bashrc
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=PORT)




