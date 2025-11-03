#!/bin/sh

stripe listen --forward-to localhost:5001/api/v1/billing/webhook
