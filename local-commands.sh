#!/bin/bash

# define variables
ROOT_PROJECT_DIR="$HOME"
PROJECT_DIR="$HOME/CPS498-Project"
LOGS_DIR="$ROOT_PROJECT_DIR/logs"
DATABASE_URL="jdbc:mysql://localhost:3306/mindracers_database?createDatabaseIfNotExist=true"
GIT_REPO_URL="https://github.com/Adderflight/CPS498-Project.git"
PACKAGE_LIST="git npm nano openjdk-17-jdk-headless mysql-server mysql-client libprotobuf-java libmariadb-java"

# log directories
mkdir -p $LOGS_DIR
touch $LOGS_DIR/frontend-install.log
touch $LOGS_DIR/frontend-start.log
#touch $LOGS_DIR/caddy-start.log
touch $LOGS_DIR/backend-start.log
touch $LOGS_DIR/backend-stop.log

# display options until the script is exited
while true; do
    echo "Select an operation to perform:"
    echo "1) Install packages (UBUNTU BASED DISTROS ONLY)"
    echo "2) Update/pull git repository"
    echo "3) Run steps 1-2"
    echo "4) Start frontend"
    echo "5) Start backend"
    echo "6) Start frontend and backend"
    echo "7) Stop frontend"
    echo "8) Stop backend"
    echo "9) Stop frontend and backend"
    echo "99) Exit"

    # prompt for choice
    read -rp "Enter your choice: " choice

# define choices
case $choice in
    1)# Install packages
        printf "\nInstalling packages\n\n"

        sudo apt install -y $PACKAGE_LIST
        printf "\nPackages installed\n\n"
        ;;
    2)# Update/pull git repository
        printf "\nUpdating git repository\n\n"

#         mkdir -p $LOGS_DIR
#         touch $LOGS_DIR/frontend-install.log
#         touch $LOGS_DIR/frontend-start.log
#         touch $LOGS_DIR/caddy-start.log
#         touch $LOGS_DIR/backend-start.log
#         touch $LOGS_DIR/backend-stop.log

        git pull $GIT_REPO_URL
        ;;
    3)# Run steps 1-2
        printf "\nRunning steps 1-2\n\n"

        printf "\nInstalling packages\n\n"
        apt install -y $PACKAGE_LIST

        printf "\nUpdating git repository\n\n"
        mkdir -p $ROOT_PROJECT_DIR
        git pull $GIT_REPO_URL
        ;;
    4)# Start frontend
        printf "\nStarting frontend using npm\n\n"

        cd $PROJECT_DIR/frontend || return

        # build npm frontend
        npm install &>$LOGS_DIR/frontend-install.log && npm start &>$LOGS_DIR/frontend-start.log & disown $!
        ;;
    5)# Start backend
        printf "\nStarting backend using mvnw spring-boot:run\n\n"
        cd $PROJECT_DIR/backend || return

        # prompt for username for database user
        #read -rp "Enter the database username: " DB_USER

        # prompt for databse password
        #read -rp "Enter the database password: " DB_PASSWORD

        # database username and password for development purposes only
        DB_USER="db_user"
        DB_PASSWORD="somepassword"

        chmod +x mvnw && env DATABASE_URL=$DATABASE_URL DATABASE_USER=$DB_USER DATABASE_PASSWORD=$DB_PASSWORD ./mvnw spring-boot:run &>$LOGS_DIR/backend-start.log & disown $!
        ;;
    6)# Start frontend and backend
        # Start frontend
        printf "\nStarting frontend using npm\n\n"

        cd $PROJECT_DIR/frontend || return

        # build npm frontend
        npm install &>$LOGS_DIR/frontend-install.log && npm start &>$LOGS_DIR/frontend-start.log & disown $!

        # Start backend
        printf "\nStarting backend using mvnw spring-boot:run\n\n"
        cd $PROJECT_DIR/backend || return

        # prompt for username for database user
        read -rp "Enter the database username: " DB_USER

        # prompt for databse password
        read -rp "Enter the database password: " DB_PASSWORD

        chmod +x mvnw && env DATABASE_URL=$DATABASE_URL DATABASE_USER=$DB_USER DATABASE_PASSWORD=$DB_PASSWORD ./mvnw spring-boot:run &>$LOGS_DIR/backend-start.log & disown $!
        ;;
    7)# Stop frontend
        printf "\nStopping frontend\n\n"
        pkill node-
        pkill node
        ;;
    8)# Stop backend
        printf "\nStopping backend\n\n"
        cd $PROJECT_DIR/backend || return
        ./mvnw spring-boot:stop &>$LOGS_DIR/backend-stop.log & disown $!
        ;;
    9)# Stop frontend and backend
        printf "\nStopping frontend and backend\n\n"
        ## stop frontend
        pkill node-
        pkill node

        ## stop backend
        cd $PROJECT_DIR/backend || return
        ./mvnw spring-boot:stop &>$LOGS_DIR/backend-stop.log & disown $!
        ;;
    99)
        printf "\nExiting script.\n"
        exit 0
        ;;
    *)
        printf "\nInvalid option selected.\n"
        ;;
esac
done
