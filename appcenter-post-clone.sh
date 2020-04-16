#!/usr/bin/env bash
case $APPCENTER_BRANCH in
    "staging")
        cp -f ./.env.production.default ./.env.production
        ;;
    "test")
        cp -f ./.env.production.default ./.env.production
        ;;
    *)
        cp -f ./.env.production.default ./.env.production
        ;;
esac
